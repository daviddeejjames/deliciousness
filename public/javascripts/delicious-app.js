
import '../sass/style.scss';

import { $, $$ } from './modules/bling'; // eslint-disable-line no-unused-vars
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

autocomplete( $('#address'), $('#lat'), $('#lng') );

typeAhead( $('.search') );

makeMap( $('#map') );
