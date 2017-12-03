
import '../sass/style.scss';

import { $, $$ } from './modules/bling'; // eslint-disable-line no-unused-vars
import autocomplete from './modules/autocomplete';

autocomplete($('#address'), $('#lat'), $('#lng'));