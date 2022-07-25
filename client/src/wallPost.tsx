import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { PostId } from "./typesClient";

import Post from "./post";

interface WallProps {
    wallUserId?: number;
}

export default function WallPost(props: WallProps) {
    // In Global State is where the information of the post to display is.
    const posts: Array<PostId> = useSelector((state: RootState) => state.posts);

    console.log("posts to display", posts);

    return (
        <div className="posts-container">
            {posts &&
                posts.map((each: PostId) => {
                    return <Post key={each.post_id} postId={each.post_id} />;
                })}
        </div>
    );
}
