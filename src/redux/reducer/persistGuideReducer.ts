import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import guideReducer from '../guide/guideSlice';


const guidePersistConfig = {
    key: 'guide',
    storage
};

const persistGuideReducer = persistReducer(guidePersistConfig, guideReducer);

export default persistGuideReducer;