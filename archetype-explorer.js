(function () {
    'use strict';

    const IMG_BASE = 'Images/Money&Me/';

    const archetypes = [
        {
            name: 'The ideal player',
            image: 'ideal-player.png',
            desc: 'A player that reads content, completes knowledge checks and engages with the gamification. The benchmark player.',
            implications: 'Designing for them is the easy part. The real challenge was making sure the platform didn\'t punish everyone else for not being them.'
        },
        {
            name: 'The speed runner',
            image: 'speed-runner.png',
            desc: 'A player that jumps straight to the knowledge checks. Doesn\'t care about content, just caring about the badges.',
            implications: 'Speed runners taught us that if knowledge checks can be gamed, they will be. We had to design reward logic that still delivered value even when the content got skipped.'
        },
        {
            name: 'The learner',
            image: 'deep-learner.png',
            desc: 'Reads everything, skips the tests. Quietly improving without caring about rewards.',
            implications: 'They validated our decision to make the experience non-linear. Forcing a learner through gamification they don\'t want is the fastest way to lose interest.'
        },
        {
            name: 'The ghost',
            image: 'ghost.png',
            desc: 'A player that engages early, then was churned. Sitting on stale knowledge and missing new content.',
            implications: 'Ghosts are the hardest archetype to design for, because they\'ve already left. Re-engagement had to feel like an invitation they wanted to take part in.'
        },
        {
            name: 'The timed-out',
            image: 'timed-out.png',
            desc: 'Completed content once. Still carries the badge, but the knowledge has moved on without them.',
            implications: 'This archetype pushed us to think about knowledge decay, not just knowledge acquisition. A badge shouldn\'t mean I knew this once.'
        }
    ];

    /* ── Helpers ──────────────────────────────────────────────── */

    function mk(tag, cls) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        return el;
    }

    function rAF(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }

    function buildPanel(arch) {
        const panel = mk('div', 'ae-content');

        const img = mk('img', 'ae-img');
        img.src = IMG_BASE + arch.image;
        img.alt = arch.name;

        const desc = mk('p', 'ae-desc');
        desc.textContent = arch.desc;

        const box = mk('div', 'ae-box');
        const boxLabel = mk('p', 'ae-box-label');
        boxLabel.textContent = 'Design implications';
        const boxText = mk('p', 'ae-box-text');
        boxText.textContent = arch.implications;
        box.append(boxLabel, boxText);

        panel.append(img, desc, box);
        return panel;
    }

    /* ── Setup ────────────────────────────────────────────────── */

    const container = document.getElementById('archetype-explorer');
    if (!container) return;

    container.className = 'ae-host';
    container.innerHTML = '';
    container.removeAttribute('aria-label');

    const leftCol     = mk('div', 'ae-left');
    const rightCol    = mk('div', 'ae-right');
    const placeholder = mk('p',   'ae-placeholder');
    const contentPanel = mk('div', 'ae-content');

    placeholder.textContent = 'Hover to explore the player types';
    contentPanel.setAttribute('aria-live', 'polite');

    rightCol.append(placeholder, contentPanel);
    container.append(leftCol, rightCol);

    /* ── Measure all panels, lock right column height ─────────── */

    function measureAndLock() {
        // Off-screen sizer matching the right column's inner width
        const innerW = rightCol.clientWidth - 32; // subtract padding
        const sizer  = document.createElement('div');
        sizer.style.cssText =
            'position:absolute;left:-9999px;top:0;width:' + innerW +
            'px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(sizer);

        const panels = archetypes.map(arch => {
            const p = buildPanel(arch);
            p.classList.add('ae-visible'); // make it measurable
            sizer.appendChild(p);
            return p;
        });

        const imgs   = Array.from(sizer.querySelectorAll('img'));
        let pending  = imgs.length || 1; // at least 1 so we always call done()

        function done() {
            pending--;
            if (pending > 0) return;

            // All images settled — find tallest panel
            let maxH = 0;
            panels.forEach(p => { maxH = Math.max(maxH, p.offsetHeight); });

            // Lock right column: panel height + top/bottom padding (16px each)
            rightCol.style.minHeight = (maxH + 32) + 'px';

            document.body.removeChild(sizer);
        }

        if (imgs.length === 0) {
            done();
        } else {
            imgs.forEach(img => {
                if (img.complete && img.naturalHeight > 0) { done(); }
                else {
                    img.addEventListener('load',  done);
                    img.addEventListener('error', done);
                }
            });
        }
    }

    // Run after layout is established
    requestAnimationFrame(measureAndLock);

    /* ── State ────────────────────────────────────────────────── */

    let active       = null;
    let transitioning = false;

    const isMobile = () => window.matchMedia('(hover: none)').matches;

    function activate(index) {
        if (active === index || transitioning) return;
        transitioning = true;
        active = index;

        buttons.forEach((btn, i) => btn.classList.toggle('ae-btn--active', i === index));
        rightCol.classList.add('ae-right--active');

        placeholder.classList.add('ae-hidden');
        contentPanel.classList.remove('ae-visible');

        setTimeout(() => {
            // Replace content
            contentPanel.innerHTML = '';
            const panel = buildPanel(archetypes[index]);
            Array.from(panel.childNodes).forEach(n => contentPanel.appendChild(n));

            rAF(() => {
                contentPanel.classList.add('ae-visible');
                transitioning = false;
            });
        }, 160);
    }

    function deactivate() {
        if (active === null || transitioning) return;
        transitioning = true;
        active = null;

        buttons.forEach(btn => btn.classList.remove('ae-btn--active'));
        rightCol.classList.remove('ae-right--active');
        contentPanel.classList.remove('ae-visible');

        setTimeout(() => {
            contentPanel.innerHTML = '';
            placeholder.classList.remove('ae-hidden');
            transitioning = false;
        }, 160);
    }

    /* ── Buttons ──────────────────────────────────────────────── */

    const buttons = archetypes.map((arch, i) => {
        const btn = mk('button', 'ae-btn');
        btn.textContent = arch.name;

        btn.addEventListener('mouseenter', () => {
            if (!isMobile()) activate(i);
        });

        btn.addEventListener('click', () => {
            if (isMobile()) {
                if (active === i) deactivate();
                else activate(i);
            }
        });

        leftCol.appendChild(btn);
        return btn;
    });

    container.addEventListener('mouseleave', () => {
        if (!isMobile()) deactivate();
    });

}());
