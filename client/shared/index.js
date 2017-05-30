import {SHARED_DIRECTIVES} from './directives';
import {SHARED_PROVIDERS} from './providers';
import {SHARED_PIPES} from './pipes';
import {SHARED_ROUTES, SHARED_COMPONENTS} from './routes';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

require('!style!raw!sass!./scss/shared.scss');

export * from './directives';
export * from './providers';
export * from './pipes';
export * from './routes';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule.forRoot(SHARED_ROUTES)
    ],
    providers: SHARED_PROVIDERS,
    declarations: [
        ...SHARED_DIRECTIVES,
        ...SHARED_PIPES,
        ...SHARED_COMPONENTS
    ],
    exports: [
        ...SHARED_DIRECTIVES,
        ...SHARED_PIPES
    ]
})
export class SharedModule {}
