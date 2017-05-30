import {RISK_SURVEY_DIRECTIVES} from './directives';
import {RISK_SURVEY_PROVIDERS} from './providers';
import {RISK_SURVEY_PIPES} from './pipes';
import {RISK_SURVEY_ROUTES, RISK_SURVEY_COMPONENTS} from './routes';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

export * from './directives';
export * from './providers';
export * from './pipes';
export * from './routes';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule.forRoot(RISK_SURVEY_ROUTES)
    ],
    providers: RISK_SURVEY_PROVIDERS,
    declarations: [
        ...RISK_SURVEY_DIRECTIVES,
        ...RISK_SURVEY_PIPES,
        ...RISK_SURVEY_COMPONENTS
    ],
    exports: [
        ...RISK_SURVEY_DIRECTIVES,
        ...RISK_SURVEY_PIPES
    ]
})
export class RiskSurveyModule {}
