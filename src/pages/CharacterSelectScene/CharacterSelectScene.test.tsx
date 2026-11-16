import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router";
import { RosterContext, type RosterContextValue } from "@context/rosterContext";
import CharacterSelectScene from "./CharacterSelectScene";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { RecruiterCard } from "./components/RecruiterCard/RecruiterCard";

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

const useMediaQueryMock = vi.hoisted(() => vi.fn(() => false));

vi.mock("@hooks/useArcadeAudio", () => ({
  useArcadeAudio: () => vi.fn(),
}));

vi.mock("@hooks/useGridColumns", () => ({
  useGridColumns: () => 2,
}));

vi.mock("@hooks/useMediaQuery", () => ({
  useMediaQuery: useMediaQueryMock,
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

const HistoryProbe = () => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      VOLVER HISTORIA
    </button>
  );
};

const renderSelectWithHistoryProbe = (initialEntry = "/select") => {
  return render(
    <RosterContext.Provider value={rosterValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <HistoryProbe />
        <Routes>
          <Route path="/select" element={<CharacterSelectScene />} />
          <Route path="/versus/:p1Id/:p2Id" element={<h1>COMBATE CARGADO</h1>} />
        </Routes>
      </MemoryRouter>
    </RosterContext.Provider>,
  );
};

describe("CharacterSelectScene", () => {
  beforeEach(() => {
    useMediaQueryMock.mockReturnValue(false);
  });
  it("selects P1 then P2 and starts the versus route", async () => {
    renderSelect("/select");
    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));

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
    renderSelect("/select");
    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "s" });
    expect(screen.getByRole("option", { name: /Vegeta/ })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps both mode buttons visible and reports the selected mode accessibly", () => {
    renderSelect("/select");
    const individual = screen.getByRole("button", { name: "INDIVIDUAL" });
    const versus = screen.getByRole("button", { name: "VERSUS 2P" });
    expect(individual).toHaveAttribute("aria-pressed", "true");
    expect(versus).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(versus);
    expect(screen.getByRole("button", { name: "INDIVIDUAL" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "VERSUS 2P" })).toHaveAttribute("aria-pressed", "true");
  });

  it("reveals the recruiter profile after the Konami sequence", async () => {
    renderSelect();
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"].forEach((key) => {
      fireEvent.keyDown(grid, { key });
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "CHRISTIAN J. TORREALBA" })).toBeInTheDocument();
    });
    expect(screen.getByText("Arquitectura")).toBeInTheDocument();
    expect(screen.getByText("Product sense")).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /PERFIL SECRETO/ })).toBeInTheDocument();
  });

  it("detects the Konami sequence while a filter control has focus", async () => {
    renderSelect("/select");
    const scene = document.querySelector(".select-scene");
    if (!scene) throw new Error("Selection scene not mounted");
    const outsideControl = document.createElement("button");
    document.body.append(outsideControl);
    outsideControl.focus();

    ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"].forEach((key) => {
      fireEvent.keyDown(outsideControl, { key });
    });

    expect(await screen.findByRole("dialog", { name: "CHRISTIAN J. TORREALBA" })).toBeInTheDocument();
    outsideControl.remove();
  });

  it("does not prevent normal a/b text entry in the search field", () => {
    renderSelect("/select");
    const filter = screen.getByRole("searchbox", { name: "Buscar" });
    filter.focus();
    const bEvent = new KeyboardEvent("keydown", { key: "b", bubbles: true, cancelable: true });
    filter.dispatchEvent(bEvent);
    const aEvent = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    filter.dispatchEvent(aEvent);
    expect(bEvent.defaultPrevented).toBe(false);
    expect(aEvent.defaultPrevented).toBe(false);
  });

  it("preserves P1 when P2 is changed or cancelled", () => {
    renderSelect("/select");
    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "Enter" });
    fireEvent.keyDown(grid, { key: "Enter" });
    expect(screen.getByRole("article", { name: "P1: Goku" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "P2: Vegeta" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cambiar luchador de P2" }));
    expect(screen.getByRole("article", { name: "P1: Goku" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "P2: sin seleccionar" })).toBeInTheDocument();
  });

  it("shows the configured CV link on the recruiter profile", () => {
    render(<RecruiterCard onClose={vi.fn()} />);
    expect(screen.getByRole("link", { name: "VER CV ↗" })).toHaveAttribute(
      "href",
      "https://christianjtr.github.io/",
    );
  });

  it("pushes versus mode into history so going back returns to individual mode", () => {
    renderSelectWithHistoryProbe("/select");

    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));
    expect(screen.getByRole("button", { name: "VERSUS 2P" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "VOLVER HISTORIA" }));
    expect(screen.getByRole("button", { name: "INDIVIDUAL" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the versus ready modal on mobile when both players are picked and starts the fight", async () => {
    useMediaQueryMock.mockReturnValue(true);
    renderSelect("/select");
    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "Enter" });
    fireEvent.keyDown(grid, { key: "Enter" });

    const dialog = screen.getByRole("dialog", { name: "¿Listo para el combate?" });
    expect(within(dialog).getByRole("heading", { name: "Goku" })).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "Vegeta" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "INICIAR COMBATE" }));
    expect(await screen.findByRole("heading", { name: "COMBATE CARGADO" })).toBeInTheDocument();
  });

  it("lets the versus ready modal change picks and closes after clearing P2", () => {
    useMediaQueryMock.mockReturnValue(true);
    renderSelect("/select");
    fireEvent.click(screen.getByRole("button", { name: "VERSUS 2P" }));
    const grid = screen.getByRole("listbox", { name: "Lista de luchadores" });

    fireEvent.keyDown(grid, { key: "Enter" });
    fireEvent.keyDown(grid, { key: "Enter" });

    const dialog = screen.getByRole("dialog", { name: "¿Listo para el combate?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "CAMBIAR P2" }));

    expect(screen.getByRole("article", { name: "P1: Goku" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "P2: sin seleccionar" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "¿Listo para el combate?" })).not.toBeInTheDocument();
  });
});
