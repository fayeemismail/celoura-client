import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState, } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";

export default function Home() {
    const navigate = useNavigate();
    
    const handleLoginpage = () => {
        navigate('/login');
    };

    const { currentUser } = useSelector((state: RootState) => state.user); // Assuming you're using Redux to manage authentication state
    if (currentUser){
        console.log(currentUser)
    }
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => { 
        // Dispatch the logout action
        dispatch(signOut());
        navigate('/login'); 
    };

    return (
        <div>
            <h1>Home Page</h1>
                <div>
                    <button
                        className="border-2 rounded-xs border-black w-25 text-white bg-amber-600"
                        onClick={handleLoginpage}
                    >
                        Login Page
                    </button>
                </div>
                <div>
                    <button
                        className="border-2 rounded-xs w-20 bg-red-600"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
        </div>
    );
}
