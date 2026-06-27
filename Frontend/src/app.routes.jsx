import { createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import { InterviewProvider } from "./features/interview/interview.context";
import InterviewPage from "./features/interview/pages/InterviewPage";

export const router = createBrowserRouter([

    {
        path: "/",          // Yeh line add karni hai (Home Path)
        element: <Login />  // Jab site khulegi toh seedha Login dikhega
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/interview",
        element: (
            <Protected>
                <InterviewProvider>
                    <InterviewPage />
                </InterviewProvider>
            </Protected>
        )
    },
    {
        path:"/interview/:id",
        element: (
            <Protected>
                <InterviewProvider>
                    <InterviewPage />
                </InterviewProvider>
            </Protected>
        )
    }
])