import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from '../user/userSlice'



const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['currentUser', 'isAuthenticated']
};

export default persistReducer(userPersistConfig, userReducer)