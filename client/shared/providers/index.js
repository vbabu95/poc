import {provideRoutes} from '@angular/router';
import {SHARED_ROUTES} from '../routes';
export const SHARED_PROVIDERS = [
    provideRoutes(SHARED_ROUTES)
];

import DomUtils from './dom-utils';
export {DomUtils as DomUtils};
SHARED_PROVIDERS.push(DomUtils);