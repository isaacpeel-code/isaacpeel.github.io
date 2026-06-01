(function () {
    'use strict';

    /* ─── Data ───────────────────────────────────────────────── */

    const data = {
        meta: {
            splash: {
                heading:    'What type of learner are you?',
                subheading: 'Take the test to see what type of learner you are and what that meant we considered when designing Money&Me',
                cta:        'Take the quiz'
            },
            totalQuestions:   4,
            restartLabel:     'Start the test again',
            resultPreheading: 'Your player type is the...',
            implicationsLabel: 'Design implications'
        },
        questions: [
            {
                id: 'q1',
                context:  'You’ve signed up for a new learning app.',
                question: 'What do you do first?',
                options: [
                    { id: 'q1a', text: 'Take the intro tour',                                           scores: { ideal: 2, learner: 2 } },
                    { id: 'q1b', text: 'Skip straight to the first test to see how I do',              scores: { speedrunner: 3 } },
                    { id: 'q1c', text: 'Browse the topics and pick the one that looks interesting',    scores: { learner: 2, ghost: 1 } },
                    { id: 'q1d', text: 'Check what badges and rewards are available and then choose',  scores: { ideal: 1, timedout: 2 } }
                ]
            },
            {
                id: 'q2',
                context:  'You earn a badge for completing a module. A few months later, the content gets updated.',
                question: 'What happens?',
                options: [
                    { id: 'q2a', text: 'I go back and do it, I want the knowledge to stay current', scores: { ideal: 3, learner: 1 } },
                    { id: 'q2b', text: 'I still have the badge, so I’m good',                  scores: { timedout: 3 } },
                    { id: 'q2c', text: 'I probably don’t notice, honestly',                     scores: { ghost: 3 } },
                    { id: 'q2d', text: 'I skim the update but don’t retake the test',           scores: { speedrunner: 1, learner: 2 } }
                ]
            },
            {
                id: 'q3',
                context:  'You’re halfway through a module and realise you already know most of this.',
                question: 'You…',
                options: [
                    { id: 'q3a', text: 'Keep reading anyway, you might learn something new',             scores: { learner: 3, ideal: 1 } },
                    { id: 'q3b', text: 'Jump to the knowledge check and see if you can pass it cold',   scores: { speedrunner: 3 } },
                    { id: 'q3c', text: 'Close and come back when there’s something more interesting', scores: { ghost: 2, timedout: 1 } },
                    { id: 'q3d', text: 'Finish it properly still, completion matters',                  scores: { ideal: 2, timedout: 1 } }
                ]
            },
            {
                id: 'q4',
                context:  'Your employer sends a notification: three new modules added.',
                question: 'You…',
                options: [
                    { id: 'q4a', text: 'Open the link and immediately learn it',                        scores: { ideal: 3, speedrunner: 1 } },
                    { id: 'q4b', text: 'Save it for later',                                             scores: { ghost: 2, timedout: 2 } },
                    { id: 'q4c', text: 'Check the link, if it’s relevant, I’ll do it',       scores: { learner: 3 } },
                    { id: 'q4d', text: 'Open all three, skim to find the quickest one to complete',     scores: { speedrunner: 3 } }
                ]
            }
        ],
        archetypes: {
            ideal: {
                name:               'Ideal player',
                illustration:       'ideal-player.png',
                desc:               'You engage with content properly, complete knowledge checks, and actually come back when things update. You’re exactly who the platform was designed for.',
                designImplications: 'Designing for you is the easy part. The real challenge was making sure the platform didn’t punish everyone else for not being you.'
            },
            speedrunner: {
                name:               'Speed runner',
                illustration:       'speed-runner.png',
                desc:               'Tests first, content never. You’ve found the most efficient path to a badge and you’re not apologising for it. Honestly, fair enough.',
                designImplications: 'Speed runners taught us that if knowledge checks can be gamed, they will be. We had to design reward logic that still delivered value even when the content got skipped.'
            },
            learner: {
                name:               'Deep learner',
                illustration:       'deep-learner.png',
                desc:               'You’re here for the knowledge, not the gamification. Badges don’t motivate you — understanding does. The platform had to make sure you didn’t feel penalised for ignoring the parts you didn’t care about.',
                designImplications: 'You validated our decision to make the experience non-linear. Forcing a learner through gamification they don’t want is the fastest way to lose them.'
            },
            ghost: {
                name:               'Ghost',
                illustration:       'ghost.png',
                desc:               'You showed up, collected some badges, then quietly disappeared. New content came and went without you. The platform doesn’t know you’ve moved on — but you have.',
                designImplications: 'Ghosts are the hardest archetype to design for, because they’ve already left. Re-engagement had to feel like an invitation, not a guilt trip.'
            },
            timedout: {
                name:               'Timed-out',
                illustration:       'timed-out.png',
                desc:               'You did everything right — once. But the world moved on and your knowledge didn’t come with it. You carry badges for things that have since been updated.',
                designImplications: 'This archetype pushed us to think about knowledge decay, not just knowledge acquisition. A badge shouldn’t mean ‘I knew this once’.'
            }
        }
    };

    /* ─── Setup ──────────────────────────────────────────────── */

    const IMG_BASE  = 'Images/Money&Me/';
    const container = document.getElementById('quiz-component');
    if (!container) return;

    container.className = 'quiz-host';
    container.removeAttribute('aria-label');

    // Phone chassis
    const phoneFrame  = mk('div', 'phone-frame');
    const phoneScreen = mk('div', 'phone-screen');

    // Status bar
    const statusBar = mk('div', 'phone-status-bar');
    statusBar.innerHTML = `
        <span class="phone-time">9:41</span>
        <div class="phone-island"></div>
        <div class="phone-status-icons">
            <svg width="64" height="12" viewBox="0 0 64 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8609 0.542969C13.4106 0.542969 13.0456 0.908012 13.0456 1.35832V9.78358C13.0456 10.2339 13.4106 10.5989 13.8609 10.5989H14.948C15.3983 10.5989 15.7634 10.2339 15.7634 9.78358V1.35832C15.7634 0.908012 15.3983 0.542969 14.948 0.542969H13.8609Z" fill="black"/>
                <path d="M8.69704 3.53258C8.69704 3.08227 9.06209 2.71723 9.51239 2.71723H10.5995C11.0498 2.71723 11.4149 3.08227 11.4149 3.53258V9.78358C11.4149 10.2339 11.0498 10.5989 10.5995 10.5989H9.51239C9.06209 10.5989 8.69704 10.2339 8.69704 9.78358V3.53258Z" fill="black"/>
                <path d="M5.16387 4.89149C4.71356 4.89149 4.34852 5.25653 4.34852 5.70684V9.78358C4.34852 10.2339 4.71356 10.5989 5.16387 10.5989H6.251C6.7013 10.5989 7.06635 10.2339 7.06635 9.78358V5.70684C7.06635 5.25653 6.7013 4.89149 6.251 4.89149H5.16387Z" fill="black"/>
                <path d="M0.815348 6.79397C0.365044 6.79397 0 7.15901 0 7.60932V9.78358C0 10.2339 0.365043 10.5989 0.815347 10.5989H1.90248C2.35278 10.5989 2.71783 10.2339 2.71783 9.78358V7.60932C2.71783 7.15901 2.35278 6.79397 1.90248 6.79397H0.815348Z" fill="black"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.673 2.63141C30.6841 2.6315 32.6183 3.41232 34.0758 4.81248C34.1856 4.92058 34.361 4.91922 34.4691 4.80943L35.5183 3.73953C35.573 3.68384 35.6035 3.60841 35.6031 3.52993C35.6026 3.45145 35.5713 3.37638 35.5159 3.32135C31.6903 -0.383157 25.6551 -0.383157 21.8296 3.32135C21.7741 3.37634 21.7427 3.45138 21.7422 3.52986C21.7417 3.60835 21.7721 3.6838 21.8268 3.73953L22.8763 4.80943C22.9843 4.91938 23.1599 4.92075 23.2696 4.81248C24.7273 3.41223 26.6617 2.63141 28.673 2.63141ZM28.673 6.1122C29.778 6.11213 30.8436 6.52713 31.6626 7.27656C31.7734 7.38292 31.9479 7.38061 32.0559 7.27136L33.1039 6.20146C33.159 6.14534 33.1897 6.06921 33.1889 5.9901C33.1881 5.91099 33.1559 5.8355 33.0996 5.78053C30.6054 3.43618 26.7428 3.43618 24.2486 5.78053C24.1922 5.8355 24.1601 5.91103 24.1594 5.99016C24.1586 6.0693 24.1894 6.14542 24.2447 6.20146L25.2923 7.27136C25.4003 7.38061 25.5748 7.38292 25.6856 7.27656C26.5041 6.52762 27.5688 6.11266 28.673 6.1122ZM30.7723 8.45409C30.7739 8.53343 30.743 8.60991 30.6869 8.66549L28.8742 10.514C28.8211 10.5683 28.7486 10.5989 28.673 10.5989C28.5974 10.5989 28.525 10.5683 28.4718 10.514L26.6588 8.66549C26.6028 8.60987 26.572 8.53336 26.5736 8.45403C26.5753 8.3747 26.6093 8.29957 26.6676 8.2464C27.8253 7.25699 29.5208 7.25699 30.6785 8.2464C30.7367 8.29962 30.7706 8.37476 30.7723 8.45409Z" fill="black"/>
                <rect x="43.2109" y="2.19141" width="17.1223" height="7.33813" rx="2.17426" fill="black"/>
                <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M56.6774 0.566406H46.8626C46.1158 0.566406 45.5343 0.566406 45.0656 0.598384C44.5901 0.630833 44.2007 0.697563 43.8431 0.845697C42.9441 1.21809 42.2298 1.93236 41.8574 2.83138C41.7093 3.18901 41.6426 3.57835 41.6101 4.05393C41.5781 4.52261 41.5781 5.1039 41.5781 5.85068V5.88147C41.5781 6.62824 41.5781 7.20972 41.6101 7.67841C41.6426 8.15399 41.7093 8.54332 41.8574 8.90095C42.2298 9.79998 42.9441 10.5142 43.8431 10.8866C44.2007 11.0348 44.5901 11.1015 45.0656 11.1339C45.5344 11.1659 46.1157 11.1659 46.8626 11.1659H56.6774C57.4242 11.1659 58.0056 11.1659 58.4743 11.1339C58.9499 11.1015 59.3392 11.0348 59.6968 10.8866C60.5959 10.5142 61.3101 9.79998 61.6825 8.90095C61.8307 8.54332 61.8974 8.15399 61.9298 7.67841C61.9618 7.20969 61.9618 6.62835 61.9618 5.8815V5.85086C61.9618 5.10401 61.9618 4.52264 61.9298 4.05393C61.8974 3.57835 61.8307 3.18901 61.6825 2.83138C61.3101 1.93236 60.5959 1.21809 59.6968 0.845697C59.3392 0.697563 58.9499 0.630833 58.4743 0.598384C58.0056 0.566406 57.4241 0.566406 56.6774 0.566406ZM44.1551 1.59898C44.3968 1.49886 44.6871 1.44146 45.1211 1.41184C45.5589 1.38197 46.1125 1.38175 46.8779 1.38175H56.6621C57.4274 1.38175 57.9811 1.38197 58.4188 1.41184C58.8529 1.44146 59.1431 1.49886 59.3848 1.59898C60.0841 1.88862 60.6396 2.44416 60.9292 3.1434C61.0294 3.38512 61.0868 3.67536 61.1164 4.10943C61.1462 4.54716 61.1465 5.10078 61.1465 5.86617C61.1465 6.63155 61.1462 7.18518 61.1164 7.6229C61.0868 8.05697 61.0294 8.34721 60.9292 8.58893C60.6396 9.28817 60.0841 9.84372 59.3848 10.1334C59.1431 10.2335 58.8529 10.2909 58.4188 10.3205C57.9811 10.3504 57.4274 10.3506 56.6621 10.3506H46.8779C46.1125 10.3506 45.5589 10.3504 45.1211 10.3205C44.6871 10.2909 44.3968 10.2335 44.1551 10.1334C43.4559 9.84372 42.9003 9.28817 42.6107 8.58893C42.5106 8.34721 42.4532 8.05697 42.4236 7.6229C42.3937 7.18518 42.3935 6.63155 42.3935 5.86617C42.3935 5.10078 42.3937 4.54716 42.4236 4.10943C42.4532 3.67536 42.5106 3.38512 42.6107 3.1434C42.9003 2.44416 43.4559 1.88862 44.1551 1.59898Z" fill="black"/>
                    <path d="M62.7772 4.23487C63.4156 4.5011 63.8643 5.13118 63.8643 5.86607C63.8643 6.60096 63.4156 7.23104 62.7772 7.49726V4.23487Z" fill="black"/>
                </g>
            </svg>
        </div>
    `;

    // Screen content area
    const screenWrap = mk('div', 'quiz-screens');

    phoneScreen.append(statusBar, screenWrap);
    phoneFrame.appendChild(phoneScreen);

    // Outer frame — 10px #F5F5F5 mat, radius = phone-frame radius + 10
    const phoneOuter = mk('div', 'phone-outer');
    phoneOuter.appendChild(phoneFrame);
    container.appendChild(phoneOuter);

    let selectedAnswers = [];

    function resetAnswers() {
        selectedAnswers = new Array(data.meta.totalQuestions).fill(null);
    }

    /* ─── Transition ─────────────────────────────────────────── */

    function setScreen(next) {
        next.style.opacity = '0';
        const prev = screenWrap.firstChild;

        const show = () => {
            screenWrap.innerHTML = '';
            screenWrap.appendChild(next);
            rAF(() => {
                next.style.transition = 'opacity 0.25s ease';
                next.style.opacity    = '1';
            });
        };

        if (prev) {
            prev.style.transition = 'opacity 0.15s ease';
            prev.style.opacity    = '0';
            setTimeout(show, 150);
        } else {
            show();
        }
    }

    function rAF(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }

    function mk(tag, cls) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    }

    /* ─── Splash ─────────────────────────────────────────────── */

    function renderSplash() {
        resetAnswers();
        const s    = data.meta.splash;
        const wrap = mk('div', 'quiz-splash');

        const middle = mk('div', 'quiz-splash-middle');
        const h = mk('h2', 'quiz-splash-heading');
        h.textContent = s.heading;
        const sub = mk('p', 'quiz-splash-sub');
        sub.textContent = s.subheading;
        middle.append(h, sub);

        const btn = mk('button', 'quiz-btn-primary');
        btn.textContent = s.cta;
        btn.addEventListener('click', () => renderQuestion(0));

        wrap.append(middle, btn);
        setScreen(wrap);
    }

    /* ─── Questions ──────────────────────────────────────────── */

    function renderQuestion(index) {
        const q     = data.questions[index];
        const total = data.meta.totalQuestions;
        const wrap  = mk('div', 'quiz-question');
        let committed = false;

        /* Top: back chevron (absolute) + centered dots */
        if (index > 0) {
            const back = mk('button', 'quiz-back');
            back.setAttribute('aria-label', 'Back');
            back.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1939 12.2316L6.11719 8.15486L10.1939 4.07812" stroke="#7C8794" stroke-width="1.6307" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
            back.addEventListener('click', () => renderQuestion(index - 1));
            wrap.appendChild(back);
        }

        const dotsEl = mk('div', 'quiz-dots');
        for (let i = 0; i < total; i++) {
            dotsEl.appendChild(mk('span', 'quiz-dot' + (i === index ? ' quiz-dot--active' : '')));
        }
        wrap.appendChild(dotsEl);

        /* Middle: context + question */
        const middle = mk('div', 'quiz-q-middle');
        const ctx = mk('p', 'quiz-context');
        ctx.textContent = q.context;
        const qText = mk('p', 'quiz-q-text');
        qText.textContent = q.question;
        middle.append(ctx, qText);

        /* Bottom: options */
        const optWrap = mk('div', 'quiz-options');
        q.options.forEach(opt => {
            const btn = mk('button', 'quiz-option');
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                if (committed) return;
                committed = true;
                btn.classList.add('quiz-option--selected');
                selectedAnswers[index] = opt.id;
                setTimeout(() => {
                    if (index + 1 < total) renderQuestion(index + 1);
                    else renderResult();
                }, 350);
            });
            optWrap.appendChild(btn);
        });

        wrap.append(middle, optWrap);
        setScreen(wrap);
    }

    /* ─── Scoring ────────────────────────────────────────────── */

    function calcScores() {
        const totals = {};
        Object.keys(data.archetypes).forEach(k => (totals[k] = 0));
        data.questions.forEach((q, i) => {
            const aid = selectedAnswers[i];
            if (!aid) return;
            const opt = q.options.find(o => o.id === aid);
            if (opt && opt.scores) {
                Object.entries(opt.scores).forEach(([k, v]) => {
                    totals[k] = (totals[k] || 0) + v;
                });
            }
        });
        return totals;
    }

    function getWinner(totals) {
        let max = -1, winner = null;
        Object.entries(totals).forEach(([k, v]) => {
            if (v > max) { max = v; winner = k; }
        });
        return data.archetypes[winner];
    }

    /* ─── Result ─────────────────────────────────────────────── */

    function renderResult() {
        const arch = getWinner(calcScores());
        const meta = data.meta;
        const wrap = mk('div', 'quiz-result');

        /* ── Top bar — inline back button, aligned with dots row ── */
        const topBar = mk('div', 'quiz-result-topbar');
        const back = mk('button', 'quiz-result-back');
        back.setAttribute('aria-label', 'Back');
        back.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1939 12.2316L6.11719 8.15486L10.1939 4.07812" stroke="#7C8794" stroke-width="1.6307" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        back.addEventListener('click', () => renderQuestion(data.meta.totalQuestions - 1));
        topBar.appendChild(back);
        wrap.appendChild(topBar);

        /* ── Scrollable body — pre-heading, name, illustration, desc ── */
        const body = mk('div', 'quiz-result-body');

        const pre = mk('p', 'quiz-result-pre');
        pre.textContent = meta.resultPreheading;

        const name = mk('h2', 'quiz-result-name');
        name.textContent = arch.name;

        const img = mk('img', 'quiz-result-img');
        img.src = IMG_BASE + arch.illustration;
        img.alt = arch.name;

        const desc = mk('p', 'quiz-result-desc');
        desc.textContent = arch.desc;

        body.append(pre, name, img, desc);
        wrap.appendChild(body);

        /* ── Pinned footer — implications box + restart CTA ── */
        const footer = mk('div', 'quiz-result-footer');

        const box = mk('div', 'quiz-result-box');
        const boxLabel = mk('p', 'quiz-result-box-label');
        boxLabel.textContent = meta.implicationsLabel;
        const imp = mk('p', 'quiz-result-box-text');
        imp.textContent = arch.designImplications;
        box.append(boxLabel, imp);

        const restart = mk('button', 'quiz-restart');
        restart.textContent = meta.restartLabel;
        restart.addEventListener('click', renderSplash);

        footer.append(box, restart);
        wrap.appendChild(footer);

        setScreen(wrap);
    }

    /* ─── Go ─────────────────────────────────────────────────── */

    renderSplash();

}());
