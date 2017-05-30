import {
    addProviders,
    inject
} from '@angular/core/testing';
import DomUtils from './DomUtils';

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('DomUtils.js', () => {

    beforeEach(() => {
        addProviders([DomUtils]);
    });

    it('should return  instance', inject([DomUtils], (domUtils:DomUtils) => {
        expect(domUtils).toBeDefined();
    }));

    it('should return name', inject([DomUtils], (domUtils:DomUtils) => {
        expect(domUtils.name).toBe('DomUtils');
    }));

});
