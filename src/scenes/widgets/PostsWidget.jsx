import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts);
	const token = useSelector((state) => state.token);
	const [isLoading, setIsLoading] = useState(false);

	const getPosts = async () => {
		setIsLoading(true);
		const response = await fetch(process.env.REACT_APP_SITE_URL + "/posts", {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await response.json();
		dispatch(setPosts({ posts: data }));
		setIsLoading(false);
	};

	const getUserPosts = async () => {
		setIsLoading(true);
		const response = await fetch(
			process.env.REACT_APP_SITE_URL + `/posts/${userId}/posts`,
			{
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const data = await response.json();
		dispatch(setPosts({ posts: data }));
		setIsLoading(false);
	};

	useEffect(() => {
		if (isProfile) {
			getUserPosts();
		} else {
			getPosts();
		}
	}, [userId]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
			{isLoading ? (
				<Box sx={{ marginX: "auto" }}>
					<CircularProgress />
				</Box>
			) : (
				posts.map(
					({
						_id,
						userId,
						firstName,
						lastName,
						description,
						location,
						picturePath,
						userPicturePath,
						likes,
						comments,
					}) => (
						<PostWidget
							key={_id}
							postId={_id}
							postUserId={userId}
							name={`${firstName} ${lastName}`}
							description={description}
							location={location}
							picturePath={picturePath}
							userPicturePath={userPicturePath}
							likes={likes}
							comments={comments}
						/>
					)
				)
			)}
		</Box>
	);
};

export default PostsWidget;
