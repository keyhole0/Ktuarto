import {AiRandom} from '../../ailogic/ai_random';
import {AiMontecarlo} from '../../ailogic/ai_montecarlo';

export function aiFactory(ainame) {
    switch (ainame) {
        case 'AiMontecarlo': return new AiMontecarlo();
        case 'AiRandom': return new AiRandom();
    }
    return null;
}
