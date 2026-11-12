<template>
  <section class="speaker-panel device-subpanel" aria-label="Speaker panel">
    <div class="speaker-vent" aria-hidden="true">
      <span v-for="index in 8" :key="index"></span>
    </div>
    <div class="speaker-label sticker-txt select-none">
      <div class="speaker-title">
        <span>Made with</span><strong>CSS</strong>
      </div>
      <div class="label-lines" aria-hidden="true">
        <span class="red"></span><span class="yellow"></span
        ><span class="blue"></span>
      </div>
    </div>
    <div class="speaker-grille" aria-hidden="true"></div>
    <div class="mic">
      <div>
        <span class="led led-blue" aria-hidden="true"></span>
        <p class="emboss-txt select-none">Mic</p>
      </div>
    </div>
  </section>
</template>

<style>
.speaker-panel {
  --speaker-padding: clamp(10px, 1.5vw, 18px);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px;
  width: min(46%, 390px);
  margin-left: calc(-1 * var(--console-padding));
  padding: var(--speaker-padding);
  border-top: 2px solid var(--panel-border);
  border-right: 2px solid var(--panel-border);
  border-radius: 0 28px 0 var(--device-radius);
}

.top-speaker-panel {
  display: none;
}
.speaker-vent {
  display: flex;
  gap: 7px;
  padding-left: 8px;
}
.speaker-vent span {
  width: 5px;
  height: 20px;
  border-radius: 999px;
  transform: skewX(-24deg);
  background: var(--vent-surface);
  box-shadow: var(--vent-shadow);
}
.speaker-label {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 100px;
}
.speaker-title {
  display: grid;
  justify-items: end;
  line-height: 1;
}
.speaker-title span,
.speaker-title strong {
  display: block;
}
.speaker-title strong {
  font-size: 30px;
  font-weight: 600;
}
.label-lines {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
}
.label-lines span {
  display: block;
  height: 2px;
}
.label-lines .red {
  background: #cb5846;
}
.label-lines .yellow {
  margin-left: 4px;
  background: #d5b949;
}
.label-lines .blue {
  margin-left: 8px;
  background: #4187b0;
}
.speaker-grille {
  grid-column: 1;
  width: min(100%, 220px);
  clip-path: inset(0 round 0 var(--device-radius) 0 var(--device-radius));
  background:
    radial-gradient(
        circle at 46% 46%,
        #151613 0 2px,
        #343631 2.2px 2.8px,
        transparent 3px
      )
      0 0 / 16px 13px,
    radial-gradient(circle at 58% 60%, #e0dbcf44 0 2.4px, transparent 2.7px) 0
      0 / 16px 13px;
}
.mic {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: end;
  justify-content: end;
  text-align: center;
}
.mic p {
  margin: 0;
}

@media (max-width: 640px) {
  .speaker-panel:not(.top-speaker-panel) {
    display: none;
  }

  /* .top-speaker-panel {
    display: flex;
    align-items: center;
    justify-content: end;
    width: auto;
    margin: calc(-1 * var(--console-padding)) calc(-1 * var(--console-padding))
      0 0;
    padding: 6px var(--console-padding) 6px 10px;
    border: solid var(--panel-border);
    border-width: 0 0 1px 1px;
    border-radius: 0 var(--device-radius) 0 12px;
  } */

  .top-speaker-panel .speaker-label {
    width: auto;
  }

  .top-speaker-panel .mic {
    display: none;
  }

  .top-speaker-panel .speaker-title {
    justify-items: end;
  }

  .top-speaker-panel .speaker-title span {
    font-size: 10px;
  }

  .top-speaker-panel .speaker-title strong {
    font-size: clamp(20px, 5vw, 24px);
  }

  .speaker-vent,
  .speaker-grille {
    display: none;
  }
  .speaker-panel {
    width: unset;
  }

  .speaker-label {
    width: unset;
    padding-left: 6px;
  }

  .mic {
    align-items: unset;
    justify-content: center;
  }

  .speaker-title {
    justify-items: unset;
  }
}

@media (max-width: 360px) {
  .top-speaker-panel {
    display: none;
  }
}
</style>
