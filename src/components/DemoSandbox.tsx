import { useState, useEffect, useRef } from "preact/hooks";
import { i18nData, type LangKey, type I18nKey } from "../utils/i18n";

const payloadAPKs = [
  "NetMirror.apk",
  "Player_pro+_v4.0.7.apk",
  "SportzX_2.6v.apk",
  "TizenTube_v1.0.3.apk",
  "Xuper_Hydra_4k.apk",
  "Xuper_TV_4.34.apk",
];

export default function DemoSandbox() {
  const [lang, setLang] = useState<LangKey>("es");
  const [step, setStep] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [pinInput, setPinInput] = useState<string>("");
  const [installedApks, setInstalledApks] = useState<string[]>([]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const authCodeRef = useRef<number>(
    Math.floor(Math.random() * 899999) + 100000,
  );

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<LangKey>;
      if (customEvent.detail === "en" || customEvent.detail === "es") {
        setLang(customEvent.detail);
      }
    };
    window.addEventListener("languagechange", handleLangChange);

    const docLang = document.documentElement.lang;
    const initialLang: LangKey =
      docLang === "en" || docLang === "es" ? docLang : "es";

    setLang(initialLang);
    setTerminalLogs([i18nData[initialLang]["term-init"]]);

    return () => window.removeEventListener("languagechange", handleLangChange);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  useEffect(() => {
    if (step === 2) {
      setTerminalLogs((prev) => [...prev, i18nData[lang]["term-found"]]);
    }
    if (step === 4) {
      let index = 0;
      const interval = setInterval(() => {
        if (index >= payloadAPKs.length) {
          clearInterval(interval);
          setTerminalLogs((prev) => [...prev, `\n[*] despliegue finalizado.`]);
          setStep(5);
          return;
        }
        const currentApk = payloadAPKs[index];
        setTerminalLogs((prev) => [
          ...prev,
          `\n[*] ${i18nData[lang]["term-inject"]} ${currentApk}... [OK]`,
        ]);
        setInstalledApks((prev) => [...prev, currentApk]);
        index++;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step, lang]);

  const handlePinInput = (e: any) => {
    const val = e.target.value;
    setPinInput(val);
    if (val === authCodeRef.current.toString()) {
      setStep(3);
      setTerminalLogs((prev) => [...prev, i18nData[lang]["term-auth"]]);
    }
  };

  const t = (key: keyof (typeof i18nData)["es"]) =>
    i18nData[lang as keyof typeof i18nData]?.[key] || key;

  return (
    <div class="sandbox-container">
      <div class="panel panel-software">
        <div class={`software-window ${step < 2 ? "state-dimmed" : ""}`}>
          <h3 class="window-title">tvbox apk installer</h3>
          <div class="queue-label">{t("pc-queue")}</div>
          <div class="queue-container">
            {payloadAPKs.map((apk) => (
              <div key={apk}>📄 {apk}</div>
            ))}
          </div>

          <div class="terminal-container" ref={terminalRef}>
            {terminalLogs.map((log, i) => (
              <span key={i} dangerouslySetInnerHTML={{ __html: log }} />
            ))}
          </div>

          <input
            type="text"
            class={`pin-entry ${step === 2 ? "clickable" : ""}`}
            placeholder="PIN"
            disabled={step !== 2}
            value={pinInput}
            onInput={handlePinInput}
          />

          <button
            class={`deploy-action ${step === 3 ? "btn-primary clickable" : ""}`}
            disabled={step !== 3 && step !== 5}
            onClick={() => (step === 3 ? setStep(4) : window.location.reload())}
          >
            {step === 5
              ? t("btn-replay")
              : step === 4
                ? t("btn-installing")
                : t("btn-deploy")}
          </button>
        </div>
      </div>

      <div class="panel panel-hardware">
        <div class="director-prompt">
          {step === 0
            ? t("step-1")
            : step === 1
              ? t("step-2")
              : step === 2
                ? t("step-3")
                : step === 3
                  ? t("step-4")
                  : step === 4
                    ? t("btn-installing")
                    : t("step-done")}
        </div>

        <div class="tv-bezel">
          <div class="screen-content">
            {step === 0 || step >= 4 ? (
              <div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-dim); padding-bottom: 10px;">
                  <div style="font-weight: bold; font-size: 1.2rem;">
                    Android TV
                  </div>
                  {step === 0 && (
                    <div
                      class="clickable"
                      onClick={() => setStep(1)}
                      style="background: var(--tv-surface); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; cursor: pointer;"
                    >
                      ⚙ {t("tv-settings")}
                    </div>
                  )}
                </div>
                <div style="margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                  {t("tv-apps")}
                </div>
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px;">
                  {installedApks.map((apk) => (
                    <div
                      key={apk}
                      style="width: 80px; height: 50px; background: var(--accent-base); color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem;"
                    >
                      {apk.substring(0, 3).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            ) : step === 1 ? (
              <div style="display: flex; height: 100%;">
                <div style="width: 40%; border-right: 1px solid var(--border-dim); padding-right: 20px; display: flex; flex-direction: column; gap: 15px; color: var(--text-muted); font-size: 0.9rem;">
                  <div style="color: var(--tv-highlight); font-weight: bold; padding-left: 10px; border-left: 2px solid var(--accent-base);">
                    {t("tv-dev-ops")}
                  </div>
                </div>
                <div style="width: 60%; padding-left: 20px;">
                  <h2 style="font-size: 1.2rem; margin-bottom: 20px;">
                    {t("tv-dev-ops")}
                  </h2>
                  <div
                    class="clickable"
                    onClick={() => setStep(2)}
                    style="padding: 15px; background: var(--tv-surface); border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;"
                  >
                    <span>{t("tv-wire-dbg")}</span>
                    <span style="background: #111; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">
                      OFF
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <h3 style="font-size: 1rem; color: var(--text-muted); margin-bottom: 10px;">
                  {t("tv-pair-code")}
                </h3>
                <h1 style="font-size: 3.5rem; letter-spacing: 12px; font-family: var(--font-mono);">
                  {authCodeRef.current}
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
