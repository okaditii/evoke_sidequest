import { useMemo, useState, type FormEvent } from "react";
import { isAddress, type Address } from "viem";
import { GamingCard } from "../components/GamingCard";
import { Icon } from "../components/Icon";
import { MintProgress } from "../components/MintProgress";
import { GAMES, gameById, GENRES } from "../data/catalog";
import { renderCardSvg, svgToFile } from "../lib/cardSvg";
import { encodeMeta, powerFor, TIER_LABEL, TIERS, type Tier } from "../lib/metadata";
import { useMintFlow } from "../state/useMintFlow";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

export function Studio() {
  const flow = useMintFlow();
  const [gameId, setGameId] = useState(GAMES[0]!.id);
  const [character, setCharacter] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [tier, setTier] = useState<Tier>("gold");
  const [lore, setLore] = useState("");
  const [recipient, setRecipient] = useState("");
  const [seed, setSeed] = useState(() => crypto.randomUUID().slice(0, 12));
  const [formError, setFormError] = useState<string | null>(null);
  const game = gameById(gameId)!;

  const card = useMemo(
    () => ({
      tier,
      character: character.trim() || "Your hero",
      title: title.trim() || "Card title",
      role: role.trim() || undefined,
      code: game.code,
      genre: game.genre,
      seed,
      power: powerFor(tier, seed),
      footer: "Studio drop",
    }),
    [tier, character, title, role, game, seed],
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const to = recipient.trim();
    if (!character.trim()) return setFormError("Give the card a character name.");
    if (!title.trim()) return setFormError("Give the card a title.");
    if (to && !isAddress(to)) return setFormError("The player's wallet address isn't valid.");
    const svg = renderCardSvg(card);
    const ok = await flow.run({
      file: svgToFile(svg, `${character}-${title}`),
      name: `${character.trim()} · ${title.trim()}`.slice(0, 80),
      description: encodeMeta({ game: game.name, genre: game.genre, tier, character: character.trim(), seed, lore }),
      giftTo: to ? (to as Address) : undefined,
    });
    if (ok) {
      setCharacter("");
      setTitle("");
      setRole("");
      setLore("");
      setRecipient("");
      setSeed(crypto.randomUUID().slice(0, 12));
    }
  }

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>For studios & event hosts</span>
          <h2 className={ui.sectionTitle}>
            <Icon name="anvil" />
            Card Studio
          </h2>
          <div className={ui.underline} />
          <p className={ui.sectionLead}>Design a character card for one of your games, mint it, and drop it straight into a player's deck.</p>
        </div>

        <div className={s.studio}>
          <form className={`${ui.glass} ${s.studioForm}`} onSubmit={submit}>
            <div className={s.twoCol}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="st-game">
                  <Icon name="games" /> Game
                </label>
                <select id="st-game" className={ui.input} value={gameId} onChange={(e) => setGameId(e.target.value)}>
                  {GENRES.map((g) => (
                    <optgroup key={g.id} label={g.name}>
                      {GAMES.filter((x) => x.genre === g.id).map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="st-char">
                  Character
                </label>
                <input id="st-char" className={ui.input} value={character} maxLength={24} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g. Jinx" />
              </div>
            </div>
            <div className={s.twoCol}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="st-title">
                  Card title
                </label>
                <input id="st-title" className={ui.input} value={title} maxLength={32} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Season 1 Champion" />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="st-role">
                  Role <span className={ui.help}>(optional)</span>
                </label>
                <input id="st-role" className={ui.input} value={role} maxLength={14} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Duelist" />
              </div>
            </div>

            <div className={ui.field}>
              <span className={ui.label} id="st-tier">
                Tier
              </span>
              <div className={s.segmented} role="group" aria-labelledby="st-tier">
                {TIERS.map((t) => (
                  <button type="button" key={t} className={`${s.seg} ${ui.tierText[t]}`} aria-pressed={tier === t} onClick={() => setTier(t)}>
                    {TIER_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className={ui.field}>
              <label className={ui.label} htmlFor="st-lore">
                Lore <span className={ui.help}>(optional)</span>
              </label>
              <textarea id="st-lore" className={ui.input} rows={2} maxLength={600} value={lore} onChange={(e) => setLore(e.target.value)} placeholder="A line players see when they open the card." />
            </div>

            <div className={ui.field}>
              <label className={ui.label} htmlFor="st-to">
                <Icon name="gift" /> Send to player <span className={ui.help}>(optional)</span>
              </label>
              <input id="st-to" className={ui.input} value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x… leave empty to keep it" spellCheck={false} autoComplete="off" />
              <span className={ui.help}>The contract mints to your wallet first; a second transaction then sends it to the player.</span>
            </div>

            {formError && (
              <p className={ui.errorText} style={{ marginBottom: "1rem" }}>
                {formError}
              </p>
            )}
            <button className={`${ui.button.primary} ${ui.buttonBlock}`} disabled={flow.busy}>
              {flow.busy ? <span className={ui.spinner} /> : <Icon name="anvil" />}
              {flow.busy ? "Minting…" : "Mint card"}
            </button>
            <div style={{ marginTop: "1rem" }}>
              <MintProgress stage={flow.stage} failedAt={flow.failedAt} error={flow.error} txHash={flow.txHash} withGift={!!recipient.trim()} />
            </div>
          </form>

          <aside className={s.preview} aria-label="Preview">
            <div className={s.previewCard}>
              <GamingCard {...card} />
            </div>
            <button type="button" className={`${ui.button.secondary} ${ui.buttonSm}`} onClick={() => setSeed(crypto.randomUUID().slice(0, 12))}>
              <Icon name="anvil" />
              Reroll art
            </button>
            <p className={ui.help}>Every card's art is drawn from scratch. Reroll for a new design; this exact card is what gets minted.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
