import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { ArcadeSettingsProvider } from "@context/ArcadeSettingsProvider";
import {
  RosterContext,
  type RosterContextValue,
} from "@context/rosterContext";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import ArcadeMenuScene from "./ArcadeMenuScene";

const goku: CharacterSummary = {
  id: 1,
  name: "Goku",
  ki: "60.000.000",
  maxKi: "90 Septillion",
  race: "Saiyan",
  gender: "Male",
  description: "El guerrero más poderoso de la Tierra.",
  image: "https://example.com/goku.png",
  affiliation: "Z Fighter",
  deletedAt: null,
};

const rosterValue: RosterContextValue = {
  status: "ready",
  characters: [goku],
  byId: new Map([[goku.id, goku]]),
  details: {},
  reload: vi.fn(),
  prefetchDetail: vi.fn().mockResolvedValue(undefined),
  getDetail: vi.fn(),
};

const SelectProbe = (): React.JSX.Element => {
  const location = useLocation();

  return <div>SELECT ROUTE {location.search}</div>;
};

const renderMenu = () =>
  render(
    <ArcadeSettingsProvider>
      <RosterContext.Provider value={rosterValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<ArcadeMenuScene />} />
            <Route path="/select" element={<SelectProbe />} />
          </Routes>
        </MemoryRouter>
      </RosterContext.Provider>
    </ArcadeSettingsProvider>,
  );

describe("ArcadeMenuScene", () => {
  it("renders only the implemented menu entries", () => {
    renderMenu();

    expect(
      screen.getByRole("menuitem", { name: /versus mode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /fighter select/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /options/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/universe explorer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/my collection/i)).not.toBeInTheDocument();
  });

  it("confirms versus mode with Enter and keeps the versus query", async () => {
    const user = userEvent.setup();
    renderMenu();

    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());

    await user.keyboard("{Enter}");

    const route = await screen.findByText(/select route/i);
    expect(route).toHaveTextContent("?versus=1");
  });

  it("moves the active option with arrows and confirms fighter select", async () => {
    const user = userEvent.setup();
    renderMenu();

    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());

    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("menuitem", { name: /fighter select/i }),
    ).toHaveAttribute("aria-current", "true");

    await user.keyboard("{Enter}");

    const route = await screen.findByText(/select route/i);
    expect(route).not.toHaveTextContent("?versus=1");
  });

  it("opens options and closes them with Escape", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("menuitem", { name: /options/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("persists audio preferences from the options panel", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("menuitem", { name: /options/i }));

    const effectsToggle = await screen.findByRole("button", {
      name: /efectos de sonido/i,
    });

    expect(effectsToggle).toHaveAttribute("aria-pressed", "false");

    await user.click(effectsToggle);

    expect(effectsToggle).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(
        window.localStorage.getItem("dragonball-arcade:effects-enabled"),
      ).toBe("true");
    });
  });
});
