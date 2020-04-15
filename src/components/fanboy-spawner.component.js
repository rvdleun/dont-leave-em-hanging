const NO_LANES = 6;
const LANE_DIFF = 360 / NO_LANES;
AFRAME.registerComponent('fanboy-spawner', {
    schema: {
        enabled: { type: 'boolean', default: false },
    },

    events: {
        laneAvailable: function(e) {
            const { lane } = e.detail;
            this.lanes[lane].shift();
            let first = true;
            this.lanes[lane].forEach(fanboyEl => {
                const fanboy = fanboyEl.components['fanboy'];
                const { distance } = fanboy.data;
                fanboyEl.setAttribute('fanboy', {
                    distance: distance + .5,
                    distanceDuration: 500 + (Math.random() * 500),
                });

                if (first) {
                    setTimeout(() => fanboyEl.setAttribute('fanboy', { active: true }), 1000);
                    first = false;
                }
            });
        }
    },

    init: function() {
        this.lanes = [];
        for(let i = 0; i < NO_LANES; i++) {
            this.lanes[i] = [];
        }

        this.nextSpawn = 0;
    },

    update: function() {
        if (!this.enabled) {
            for(let i = 0; i < NO_LANES; i++) {
                this.lanes[i].forEach(fanboyEl => fanboyEl.emit('removeFanboy'));
                this.lanes[i] = [];
            }
        }
    },

    tick: function(time, delta) {
        if (this.data.enabled === false) {
            return;
        }

        this.nextSpawn-=delta;

        if (this.nextSpawn < 0) {
            // const lane = (Math.floor(Math.random() * 3));
            // this.spawnFanboy(lane);

            this.spawnFanboy(Math.floor(Math.random() * NO_LANES));
            this.nextSpawn = Math.random() * 2000;
        }
    },

    spawnFanboy: function(lane) {
        const distance = -.75 - (.5 * this.lanes[lane].length);
        if (distance < -5) {
            return;
        }

        const laneEl = document.createElement('a-entity');
        laneEl.setAttribute('rotation', {
            x: 0,
            y: (lane * LANE_DIFF) + (Math.random() * (LANE_DIFF / 1.75)),
            z: 0
        });

        const fanboyEl = document.createElement('a-entity');
        fanboyEl.setAttribute('fanboy', {
            distance,
            distanceDuration: 5000,
            hand: Math.random() < .5 ? 'left': 'right',
            lane,
            type: Math.random() < .5 ? 'fist' : 'hand',
        });
        fanboyEl.setAttribute('position', '0 0 -5');
        laneEl.appendChild(fanboyEl);
        this.el.appendChild(laneEl);

        this.lanes[lane].push(fanboyEl);

        if (this.lanes[lane].length === 1) {
            setTimeout(() => fanboyEl.setAttribute('fanboy', { active: true }), 5000);
        }
    }
});
