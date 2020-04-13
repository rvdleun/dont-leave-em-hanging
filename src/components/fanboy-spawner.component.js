const NO_LANES = 6;
const LANE_DIFF = 360 / NO_LANES;
AFRAME.registerComponent('fanboy-spawner', {
    events: {
        laneAvailable: function(e) {
            const lane = e.detail.lane;
            this.lanes[lane].shift();
            this.lanes[lane].forEach(fanboyEl => {
                const fanboy = fanboyEl.components['fanboy'];
                const { distance } = fanboy.data;
                fanboyEl.setAttribute('fanboy', {
                    distance: distance + .5,
                    distanceDuration: 500 + (Math.random() * 500),
                });
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

    tick: function(time, delta) {
        this.nextSpawn-=delta;

        if (this.nextSpawn < 0) {
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
            y: 45 - (lane * LANE_DIFF),
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
    }
});
