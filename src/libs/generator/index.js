import { randomizer, range, format } from 'uvk';
import { faker } from './faker';
import { nationalities } from 'const/nationalities';
import { positions } from 'const/positions';
import { modules } from 'const/modules';
import { teamNames } from 'config/providers/teamDefinitions';
import { playerHelper, coachHelper } from 'libs/helpers';
import { CURRENCY_MODIFIERS, COLOURS } from "const";
import { COACH_AGE_RANGE, PLAYER_AGE_RANGE, SKILL_RANGE } from "config";
import { ulid } from "ulid";


export default {
    newspaper(nationality = 'it') {
        return faker.newspaper(nationality);
    },
    teamName(nationality = 'it') {
        return format(randomizer.pickOne(teamNames), faker.city(nationality));
    },
    playerAge() {
        return randomizer.int(PLAYER_AGE_RANGE[0], PLAYER_AGE_RANGE[1]);
    },
    coachAge() {
        return randomizer.int(COACH_AGE_RANGE[0], COACH_AGE_RANGE[1]);
    },
    skill() {
        return randomizer.int(SKILL_RANGE[0], SKILL_RANGE[1]);
    },
    position() {
        return randomizer.pickOne(positions);
    },
    module() {
        return randomizer.pickOne(modules);
    },
    nationality() {
        return randomizer.pickOne(nationalities);
    },
    status() {
        return {
            morale: randomizer.int(10, 100)
        };
    },
    statusModifiers() {
        return {
            decreases: [
                {
                    chance: randomizer.int(10, 90),
                    value: randomizer.int(1, 15)
                }
            ],
            increases: [
                {
                    chance: randomizer.int(10, 90),
                    value: randomizer.int(1, 15)
                }
            ]
        };
    },
    person(locale) {
        return {
            id: ulid(),
            name: faker.name(locale),
            surname: faker.surname(locale),
            contract: randomizer.int(1, 5)
        };
    },
    coach(forcedValues = {}) {
        const locale = forcedValues.nationality || 'it';
        const person = this.person(locale);

        const skill = this.skill();
        const age = this.coachAge();

        return {
            ...person,
            status: this.status(),
            age,
            nationality: locale,
            skill,
            module: this.module(),
            stats: { history: [], p: 0, w: 0, d: 0, l: 0 },
            wage: coachHelper.calculateWage({ skill, age }),
            ...forcedValues
        };
    },
    player(forcedValues = {}) {
        const locale = forcedValues.nationality || 'it';
        const person = this.person(locale);
        const position = this.position();
        const age = this.playerAge();
        const skill = this.skill();
        const value = playerHelper.calculateValue({ position, skill, age });

        return {
            ...person,
            age,
            nationality: locale,
            skill,
            value,
            position,
            wage: playerHelper.calculateWage({ age, value }),
            status: { ...this.status(), injured: false },
            stats: { played: null, avg: null, goals: null, mvp: null, rates: [], history: [], },
            ...forcedValues
        };
    },
    players(number = 10, forcedValues = {}) {
        return range(number).map(() => this.player(forcedValues));
    },
    team(forcedValues = {}) {
        const rosterSize = randomizer.int(18, 29);
        const nationality = forcedValues.nationality || 'it';
        const name = forcedValues.name || this.teamName(nationality);
        const id = ulid();
        const mostPlayers = Math.round(rosterSize * (1 - 0.8));
        const roster = this.players(mostPlayers, { nationality });
        roster.push(this.player({ position: 'GK', nationality }));
        range(rosterSize - mostPlayers).forEach(() => {
            roster.push(this.player({ nationality: this.nationality() }));
        });
        const coachNationality = randomizer.chance(90) ? nationality : this.nationality();
        return {
            id,
            name,
            colours: this.teamColour(),
            status: this.status(),
            nationality,
            stats: { positionTrend: [], history: [], p: 0, w: 0, d: 0, l: 0 },
            finance: randomizer.int(1, 100) * CURRENCY_MODIFIERS.MILLIONS,
            coach: this.coach({ nationality: coachNationality }),
            roster
        };
    },
    teams(number = 8, forcedValues = {}) {
        const names = [];
        while (names.length < number) {
            const name = this.teamName(forcedValues.nationality || 'it');
            if (names.indexOf(names) < 0) names.push(name);
        }

        return names.map(name => this.team({ name, ...forcedValues }));
    },
    teamColour() {
        const firstColour = randomizer.pickOne(COLOURS);
        const secondColour = randomizer.pickOne(COLOURS);
        return [firstColour, secondColour];
    }
};
