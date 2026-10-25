(function () {
    const root = document.getElementById("cinema");
    const stage = document.getElementById("stage");
    const picture = document.getElementById("picture");
    const entry = document.getElementById("entry");
    const entryTitle = document.getElementById("entry-title");
    const slate = document.getElementById("slate");
    const video = document.getElementById("reel");
    const badge = document.getElementById("provisional");
    const controls = document.getElementById("controls");
    const playButton = document.getElementById("play");
    const seek = document.getElementById("seek");
    const timeEl = document.getElementById("time");
    const lengthEl = document.getElementById("length");
    const fullButton = document.getElementById("full");
    const status = document.getElementById("status");
    const iconPlay = playButton.querySelector(".icon-play");
    const iconPause = playButton.querySelector(".icon-pause");
    const iconReplay = playButton.querySelector(".icon-replay");
    const iconEnter = fullButton.querySelector(".icon-enter");
    const iconExit = fullButton.querySelector(".icon-exit");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entryHold = reduceMotion ? 280 : 3200;

    let manifest = null;
    let program = null;
    let spans = [];
    let time = 0;
    let playing = false;
    let drag = false;
    let opened = false;
    let started = false;
    let activeId = null;
    let currentSpan = null;
    let audio = null;
    let musicIn = 0;
    let uiTimer = 0;
    let clock = 0;
    let lastTick = 0;
    let entryTimer = 0;
    let userTookControl = false;

    fetch(sequenceUrl())
        .then(function (response) {
            if (!response.ok) throw new Error("No se pudo leer la secuencia.");
            return response.json();
        })
        .then(boot)
        .catch(function (error) {
            fail(error.message || "No se pudo leer la secuencia.");
        });

    function pageBase() {
        return new URL("./", document.baseURI);
    }

    function sequenceUrl() {
        const requested = new URLSearchParams(location.search).get("sequence");
        const name = requested && /^[a-z0-9-]+\.json$/.test(requested)
            ? requested
            : "now-see-yourself.json";
        return new URL("sequences/" + name, pageBase());
    }

    function boot(data) {
        manifest = data;
        program = buildProgram(data);
        paintTitle(entryTitle, data.title || "NOW, SEE YOURSELF");
        if (data.status === "primer-corte") {
            program.mark = "Primer corte";
            badge.hidden = false;
            badge.textContent = program.mark;
        } else if (!program.provisional) {
            program.mark = null;
            badge.hidden = true;
        } else {
            program.mark = null;
            badge.textContent = program.label;
        }
        if (program.mode === "picture") {
            entryTitle.hidden = true;
            entry.classList.add("is-film");
            entryHold = reduceMotion ? 80 : 240;
            probeAll(program.items)
                .then(function (ready) {
                    spans = layout(ready);
                    begin();
                })
                .catch(function (error) {
                    fail(error.message || "No se pudo abrir el metraje declarado.");
                });
            return;
        }
        if (!program.items.length) {
            fail("La secuencia no tiene picture ni demo.");
            return;
        }
        spans = layout(program.items);
        begin();
    }

    function begin() {
        lengthEl.textContent = format(duration());
        seek.max = "1000";
        seek.setAttribute("aria-valuemax", duration().toFixed(1));
        render();
        bind();
        entryTimer = window.setTimeout(openProgram, entryHold);
    }

    function buildProgram(data) {
        const pictureItems = Array.isArray(data.picture) ? data.picture : [];
        if (pictureItems.length) {
            return {
                mode: "picture",
                title: data.title,
                provisional: false,
                mark: null,
                items: pictureItems.map(function (item) {
                    return {
                        id: item.id || item.src,
                        kind: "video",
                        src: item.src,
                        in: Number(item.in) || 0,
                        out: item.out == null ? null : Number(item.out),
                    };
                }),
            };
        }
        const demo = data.demo || {};
        return {
            mode: "slate",
            title: data.title,
            provisional: true,
            label: demo.label || "Demo técnica provisional",
            items: (demo.items || [])
                .map(function (item) {
                    return {
                        id: item.id,
                        kind: item.kind,
                        role: item.role,
                        kicker: item.kicker,
                        heading: item.heading,
                        note: item.note,
                        duration: Number(item.duration) || 0,
                    };
                })
                .filter(function (item) {
                    return item.duration > 0;
                }),
        };
    }

    function probeAll(items) {
        return Promise.all(items.map(probeClip));
    }

    function probeClip(item) {
        return new Promise(function (resolve, reject) {
            const el = document.createElement("video");
            el.preload = "metadata";
            el.playsInline = true;
            el.onloadedmetadata = function () {
                const full = el.duration;
                const end = item.out == null ? full : Math.min(item.out, full);
                if (!(end > item.in)) {
                    reject(new Error("in/out inválidos en " + item.src));
                    return;
                }
                resolve(Object.assign({}, item, { end: end, duration: end - item.in }));
            };
            el.onerror = function () {
                reject(new Error("No se encontró el archivo declarado en picture: " + item.src));
            };
            el.src = new URL(item.src, pageBase()).href;
        });
    }

    function layout(items) {
        let at = 0;
        return items.map(function (item) {
            const span = Object.assign({}, item, { at: at });
            at += item.duration;
            return span;
        });
    }

    function duration() {
        if (!spans.length) return 0;
        const last = spans[spans.length - 1];
        return last.at + last.duration;
    }

    function bind() {
        playButton.addEventListener("click", toggle);
        fullButton.addEventListener("click", toggleFullscreen);
        seek.addEventListener("input", function () {
            userTookControl = true;
            drag = true;
            seekTo((Number(seek.value) / 1000) * duration());
            revealUi();
        });
        seek.addEventListener("change", function () {
            drag = false;
        });
        controls.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        picture.addEventListener("click", onStageClick);
        picture.addEventListener("pointermove", revealUi);
        entry.addEventListener("click", function (event) {
            event.stopPropagation();
            openProgram();
        });
        document.addEventListener("keydown", onKey);
        document.addEventListener("fullscreenchange", render);
        document.addEventListener("webkitfullscreenchange", render);
        document.addEventListener("visibilitychange", function () {
            if (document.hidden && playing) pause();
        });
        video.addEventListener("timeupdate", onVideoTime);
        video.addEventListener("ended", onVideoEnded);
    }

    function onKey(event) {
        if (event.target && event.target.closest && event.target.closest("input, textarea") && event.target !== seek) {
            return;
        }
        if (!opened) {
            if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
                event.preventDefault();
                openProgram();
            }
            return;
        }
        if (event.key === " " || event.key === "k" || event.key === "K") {
            event.preventDefault();
            toggle();
            revealUi();
        } else if (event.key === "f" || event.key === "F") {
            event.preventDefault();
            toggleFullscreen();
        } else if (event.key === "ArrowRight" && event.target !== seek) {
            event.preventDefault();
            seekBy(5);
        } else if (event.key === "ArrowLeft" && event.target !== seek) {
            event.preventDefault();
            seekBy(-5);
        } else if (event.key === "Home") {
            event.preventDefault();
            seekTo(0);
        } else if (event.key === "End") {
            event.preventDefault();
            seekTo(duration());
        } else if (event.key === "Escape" && stage.classList.contains("is-fill")) {
            stage.classList.remove("is-fill");
            render();
        }
    }

    function onStageClick(event) {
        if (!opened || event.target.closest(".controls") || event.target.closest(".entry")) return;
        if (playing && !root.classList.contains("is-ui")) {
            revealUi();
            return;
        }
        toggle();
    }

    function openProgram() {
        if (opened) return;
        opened = true;
        window.clearTimeout(entryTimer);
        entry.classList.add("is-done");
        entry.setAttribute("aria-hidden", "true");
        controls.hidden = false;
        root.dataset.state = "paused";
        revealUi();
        if (reduceMotion) startPlay();
        else {
            const fallback = window.setTimeout(startPlay, 1100);
            entry.addEventListener("transitionend", function (event) {
                if (event.propertyName !== "opacity") return;
                window.clearTimeout(fallback);
                startPlay();
            });
        }
    }

    function startPlay() {
        if (started) return;
        started = true;
        if (!userTookControl) play();
    }

    function toggle() {
        userTookControl = true;
        if (playing) pause();
        else play();
    }

    function play() {
        if (playing) return;
        if (time >= duration() - 0.05) time = 0;
        playing = true;
        root.dataset.state = "playing";
        status.textContent = program.mark
            ? "Reproduciendo el primer corte."
            : program.provisional
                ? "Reproduciendo la demo técnica provisional."
                : "Reproduciendo.";
        if (program.mode === "picture") syncPicture(true);
        else {
            lastTick = performance.now();
            clock = requestAnimationFrame(tick);
        }
        syncMusic(true);
        render();
    }

    function pause() {
        playing = false;
        cancelAnimationFrame(clock);
        if (!video.paused) video.pause();
        if (audio && !audio.paused) audio.pause();
        root.dataset.state = time >= duration() - 0.05 ? "ended" : "paused";
        status.textContent = root.dataset.state === "ended" ? "Fin de la proyección." : "Pausa.";
        render();
    }

    function tick(now) {
        if (!playing || program.mode !== "slate") return;
        const delta = Math.min(0.1, (now - lastTick) / 1000);
        lastTick = now;
        time = Math.min(duration(), time + delta);
        if (time >= duration()) {
            time = duration();
            render();
            pause();
            root.dataset.state = "ended";
            status.textContent = "Fin de la demo técnica.";
            render();
            return;
        }
        render();
        clock = requestAnimationFrame(tick);
    }

    function seekBy(delta) {
        userTookControl = true;
        seekTo(Math.min(duration(), Math.max(0, time + delta)));
        revealUi();
    }

    function seekTo(next) {
        time = Math.min(duration(), Math.max(0, next));
        if (time >= duration()) {
            playing = false;
            cancelAnimationFrame(clock);
            if (!video.paused) video.pause();
            if (audio) audio.pause();
            root.dataset.state = "ended";
        } else if (program.mode === "picture") {
            syncPicture(playing);
        }
        syncMusic(playing);
        render();
    }

    function syncPicture(shouldPlay) {
        const span = spanAt(time);
        if (!span) return;
        const offset = span.in + (time - span.at);
        if (currentSpan !== span || video.currentSrc !== new URL(span.src, pageBase()).href) {
            currentSpan = span;
            loadSpan(span, offset, shouldPlay);
            return;
        }
        if (Math.abs(video.currentTime - offset) > 0.35) video.currentTime = offset;
        if (shouldPlay) {
            const pending = video.play();
            if (pending) pending.catch(holdForGesture);
        }
    }

    function loadSpan(span, offset, shouldPlay) {
        const url = new URL(span.src, pageBase()).href;
        const apply = function () {
            const target = Math.min(span.end - 0.04, Math.max(span.in, offset));
            if (Math.abs(video.currentTime - target) > 0.05) video.currentTime = target;
            if (shouldPlay && playing) {
                const pending = video.play();
                if (pending) pending.catch(holdForGesture);
            }
        };
        video.hidden = false;
        video.onloadedmetadata = apply;
        if (video.currentSrc === url && video.readyState >= 1) {
            apply();
            return;
        }
        video.src = url;
        video.load();
    }

    function onVideoTime() {
        if (program.mode !== "picture" || !currentSpan || !playing) return;
        if (video.currentSrc !== new URL(currentSpan.src, pageBase()).href) return;
        if (video.currentTime >= currentSpan.end - 0.08) {
            advance();
            return;
        }
        time = currentSpan.at + Math.max(0, video.currentTime - currentSpan.in);
        render();
    }

    function onVideoEnded() {
        if (program.mode === "picture") advance();
    }

    function advance() {
        const index = spans.indexOf(currentSpan);
        if (index >= 0 && index < spans.length - 1) {
            currentSpan = spans[index + 1];
            time = currentSpan.at;
            loadSpan(currentSpan, currentSpan.in, playing);
            render();
            return;
        }
        time = duration();
        if (!video.paused) video.pause();
        playing = false;
        cancelAnimationFrame(clock);
        if (audio) audio.pause();
        root.dataset.state = "ended";
        status.textContent = "Fin de la proyección.";
        render();
    }

    function syncMusic(shouldPlay) {
        if (program.mode !== "picture" || !manifest.music || !manifest.music.src) return;
        if (!audio) {
            audio = new Audio(new URL(manifest.music.src, pageBase()).href);
            audio.preload = "auto";
            musicIn = Number(manifest.music.in) || 0;
        }
        const target = musicIn + time;
        if (Math.abs(audio.currentTime - target) > 0.4) audio.currentTime = target;
        if (shouldPlay) {
            const pending = audio.play();
            if (pending) pending.catch(holdForGesture);
        } else if (!audio.paused) {
            audio.pause();
        }
    }

    function holdForGesture() {
        playing = false;
        cancelAnimationFrame(clock);
        root.dataset.state = "paused";
        status.textContent = "El navegador pidió un gesto para empezar.";
        revealUi();
        render();
    }

    function spanAt(value) {
        for (let index = 0; index < spans.length; index += 1) {
            const span = spans[index];
            if (index === spans.length - 1 || value < span.at + span.duration) return span;
        }
        return null;
    }

    function render() {
        const span = spanAt(time);
        if (program.mode === "slate") {
            video.hidden = true;
            slate.hidden = false;
            if (span && span.id !== activeId) {
                activeId = span.id;
                drawSlate(span);
            }
        } else {
            slate.hidden = true;
            video.hidden = false;
        }
        if (!drag && duration()) seek.value = String(Math.round((time / duration()) * 1000));
        timeEl.textContent = format(time);
        lengthEl.textContent = format(duration());
        seek.setAttribute("aria-valuenow", time.toFixed(1));
        seek.setAttribute("aria-valuetext", format(time));
        const fullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement || stage.classList.contains("is-fill"));
        const ended = root.dataset.state === "ended";
        iconPlay.hidden = playing || ended;
        iconPause.hidden = !playing;
        iconReplay.hidden = !ended;
        iconEnter.hidden = fullscreen;
        iconExit.hidden = !fullscreen;
        playButton.setAttribute(
            "aria-label",
            ended ? "Volver a proyectar" : playing ? "Pausar" : "Reproducir"
        );
        fullButton.setAttribute("aria-label", fullscreen ? "Salir de pantalla completa" : "Pantalla completa");
    }

    function drawSlate(item) {
        slate.replaceChildren();
        if (item.kind === "title" || item.kind === "hold") {
            const title = document.createElement("p");
            title.className = "slate-title";
            paintTitle(title, program.title || "NOW, SEE YOURSELF");
            slate.append(title);
            if (item.kind === "hold" && item.note) slate.append(note(item.note));
        } else if (item.kind === "gap") {
            slate.append(kicker(item.kicker || item.role || "Hueco"));
            slate.append(rule());
            const heading = document.createElement("h2");
            heading.className = "slate-heading";
            heading.textContent = item.heading || "Sin material";
            slate.append(heading);
            if (item.note) slate.append(note(item.note));
        } else if (item.note) {
            slate.append(note(item.note));
        }
        slate.classList.remove("is-in");
        void slate.offsetWidth;
        slate.classList.add("is-in");
    }

    function paintTitle(node, title) {
        node.replaceChildren();
        const comma = title.indexOf(",");
        const lines = comma === -1 ? [title] : [title.slice(0, comma + 1).trim(), title.slice(comma + 1).trim()];
        lines.forEach(function (line) {
            const span = document.createElement("span");
            span.textContent = line;
            node.append(span);
        });
    }

    function kicker(text) {
        const node = document.createElement("p");
        node.className = "slate-kicker";
        node.textContent = text;
        return node;
    }

    function note(text) {
        const node = document.createElement("p");
        node.className = "slate-note";
        node.textContent = text;
        return node;
    }

    function rule() {
        const node = document.createElement("hr");
        node.className = "rule";
        return node;
    }

    function revealUi() {
        root.classList.add("is-ui");
        window.clearTimeout(uiTimer);
        uiTimer = window.setTimeout(function () {
            if (root.dataset.state === "playing") root.classList.remove("is-ui");
        }, 2600);
    }

    function toggleFullscreen() {
        const native = document.fullscreenElement || document.webkitFullscreenElement;
        if (native) {
            const exit = document.exitFullscreen || document.webkitExitFullscreen;
            exit.call(document);
            return;
        }
        if (stage.classList.contains("is-fill")) {
            stage.classList.remove("is-fill");
            render();
            return;
        }
        const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
        if (!request) {
            stage.classList.add("is-fill");
            render();
            return;
        }
        const pending = request.call(stage);
        if (pending && pending.catch) pending.catch(function () {
            stage.classList.add("is-fill");
            render();
        });
    }

    function fail(message) {
        window.clearTimeout(entryTimer);
        opened = true;
        entry.classList.add("is-done");
        controls.hidden = true;
        video.hidden = true;
        slate.hidden = false;
        badge.hidden = false;
        root.dataset.state = "paused";
        slate.replaceChildren(kicker("Demo técnica provisional"), rule());
        const heading = document.createElement("h2");
        heading.className = "slate-heading";
        heading.textContent = "Secuencia no disponible";
        slate.append(heading, note(message));
        status.textContent = message;
    }

    function format(value) {
        const whole = Math.max(0, Math.floor(value));
        const minutes = Math.floor(whole / 60);
        const seconds = String(whole % 60).padStart(2, "0");
        return minutes + ":" + seconds;
    }
})();
