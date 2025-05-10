import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import adminReducer from '../admin/adminSlice';



const adminPersistConfig = {
    key: 'admin',
    storage,
};


const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

export default persistedAdminReducer;