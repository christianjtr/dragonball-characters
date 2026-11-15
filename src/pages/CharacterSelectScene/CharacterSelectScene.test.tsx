import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { RosterContext, type RosterContextValue } from "@context/rosterContext";
import CharacterSelectScene from "./CharacterSelectScene";
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

const vegeta: CharacterSummary = {
  ...goku,
  id: 2,
  name: "Vegeta",
  image: "https://example.com/vegeta.png",
};

const rosterValue: RosterContextValue = {
  status: "ready",
  characters: [goku, vegeta],
  byId: new Map([[goku.id, goku], [vegeta.id, vegeta]]),
  details: {},
  reload: vi.fn(),
  prefetchDetail: vi.fn().mockResolvedValue(undefined),
  getDetail: vi.fn(),
};

vi.mock("@hooks/useArcadeAudio", () => ({
  useArcadeAudio: () => vi.fn(),
}));

vi.mock("@hooks/useGridColumns", () => ({
  useGridColumns: () => 2,
}));

vi.mock("@hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));

const renderSelect = (initialEntry = "/select?versus=1") => {
  return render(
    <RosterContext.Provider value={rosterValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/select" element={<CharacterSelectScene />} />
          <Route path="/versus/:p1Id/:p2Id" element={<h1>COMBATE CARGADO</h1>} />
        </Routes>
      </MemoryRouter>
    </RosterContext.Provider>,
  );
};

describe("CharacterSelectScene", () => {
  it("selects P1 then P2 and starts the versus route", async () => {
    renderSelect();

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Lista de luchadores" }), {
      key: "Enter",
    });
    expect(screen.getByRole("heading", { name: "Goku" })).toBeInTheDocument();
    expect(screen.getByText("Elige un luchador para P2.", { exact: false })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Lista de luchadores" }), {
      key: "Enter",
    });
    expect(screen.getByRole("heading", { name: "Vegeta" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Lista de luchadores" }), {
      key: "Enter",
    });
    expect(await screen.findByRole("heading", { name: "COMBATE CARGADO" })).toBeInTheDocument();
  });

  it("supports WASD grid navigation", () => {
    renderSelect();
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "s" });
    expect(screen.getByRole("option", { name: /Vegeta/ })).toHaveAttribute("aria-selected", "true");
  });

  it("reveals the recruiter profile after the Konami sequence", async () => {
    renderSelect();
    const scene = document.querySelector(".select-scene");
    if (!scene) throw new Error("Selection scene not mounted");

    ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"].forEach((key) => {
      fireEvent.keyDown(scene, { key });
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "PLAYER 01" })).toBeInTheDocument();
    });
    expect(screen.getByText("Arquitectura")).toBeInTheDocument();
    expect(screen.getByText("Product sense")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /PERFIL SECRETO/ })).toBeInTheDocument();
  });

  it("preserves P1 when P2 is changed or cancelled", () => {
    renderSelect();
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "Enter" });
    fireEvent.keyDown(grid, { key: "Enter" });
    expect(screen.getByRole("article", { name: "P1: Goku" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "P2: Vegeta" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cambiar luchador de P2" }));
    expect(screen.getByRole("article", { name: "P1: Goku" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "P2: sin seleccionar" })).toBeInTheDocument();
  });
});
