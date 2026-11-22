import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import FighterProfileScene from "./FighterProfileScene";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

const goku: CharacterSummary = {
  id: 1,
  name: "Goku",
  ki: "60.000.000",
  maxKi: "90.000.000",
  race: "Saiyan",
  gender: "Male",
  description: "Guerrero saiyajin.",
  image: "https://example.com/goku.png",
  affiliation: "Z Fighter",
  deletedAt: null,
};

const playMock = vi.hoisted(() => vi.fn());
const useMediaQueryMock = vi.hoisted(() => vi.fn(() => false));
const useCharacterDetailMock = vi.hoisted(() => vi.fn());

vi.mock("@hooks/useArcadeAudio", () => ({ useArcadeAudio: () => playMock }));
vi.mock("@hooks/useMediaQuery", () => ({ useMediaQuery: useMediaQueryMock }));
vi.mock("@hooks/useCharacterDetail", () => ({
  useCharacterDetail: useCharacterDetailMock,
}));

const LocationProbe = () => {
  const location = useLocation();
  return (
    <output data-testid="location">
      {`${location.pathname}${location.search}`}
    </output>
  );
};

const renderProfile = (initialEntry = "/fighters/1") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Routes>
        <Route path="/fighters/:id" element={<FighterProfileScene />} />
        <Route path="/select" element={<p>Pantalla de selección</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("FighterProfileScene navigation", () => {
  beforeEach(() => {
    playMock.mockClear();
    useMediaQueryMock.mockReturnValue(false);
    useCharacterDetailMock.mockReturnValue({
      id: 1,
      summary: goku,
      detail: {
        ...goku,
        originPlanet: {
          id: 6,
          name: "Tierra",
          isDestroyed: false,
          description: "Planeta natal.",
          image: "https://example.com/earth.png",
          deletedAt: null,
        },
        transformations: [],
      },
      status: "ready",
      error: undefined,
      retry: vi.fn(),
    });
  });

  it("links back to the roster with focus restoration", () => {
    renderProfile();
    expect(screen.getByRole("link", { name: "Volver a luchadores" })).toHaveAttribute(
      "href",
      "/select?focus=1",
    );
  });

  it("returns to the roster with Escape and plays the back cue", () => {
    renderProfile();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByTestId("location")).toHaveTextContent("/select?focus=1");
    expect(playMock).toHaveBeenCalledWith("back");
  });

  it("shows the compact hint on small screens", () => {
    useMediaQueryMock.mockReturnValue(true);
    renderProfile();
    expect(screen.getByText("toca para regresar")).toBeInTheDocument();
    expect(screen.queryByText("Esc")).not.toBeInTheDocument();
  });
});
