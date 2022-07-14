import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const params = useParams();
    const history = useHistory();

    console.log("params", params);
    console.log("history", history);

    useEffect(() => {
        console.log("Other Profile just render.");
        /* 
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)

        Browser browser to se the rout. -> we have a hook called use Params
        */
        let abort = false;
        if (!abort) {
            //Here we make the fetch in the server.
            // only send Integer.
            // not found we want to render something saying NOT Found.
            // Searching myself we should go to our profile page.
            /* if the other user is myself
                history.push("/")
                or
                history.replace("/")
            */
        }
        return () => {
            abort = true;
        };
    });
    return (
        <>
            <h1>OTHER PROFILE!</h1>
        </>
    );
}
