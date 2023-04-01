import {
	ChatBubbleOutlineOutlined,
	AddOutlined,
	FavoriteBorderOutlined,
	FavoriteOutlined,
	ShareOutlined,
} from "@mui/icons-material";
import {
	Box,
	Divider,
	IconButton,
	InputBase,
	Typography,
	useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
	postId,
	postUserId,
	name,
	description,
	location,
	picturePath,
	userPicturePath,
	likes,
	comments,
}) => {
	const [isComments, setIsComments] = useState(false);
	const [comment, setComment] = useState("");
	const dispatch = useDispatch();
	const token = useSelector((state) => state.token);
	const loggedInUserId = useSelector((state) => state.user._id);
	const isLiked = Boolean(likes[loggedInUserId]);
	const likeCount = Object.keys(likes).length;

	const { palette } = useTheme();
	const main = palette.neutral.main;
	const primary = palette.primary.main;

	const patchLike = async () => {
		const response = await fetch(
			process.env.REACT_APP_SITE_URL + `/posts/${postId}/like`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: loggedInUserId }),
			}
		);
		const updatedPost = await response.json();
		dispatch(setPost({ post: updatedPost }));
	};

	const addComment = async () => {
		const response = await fetch(
			process.env.REACT_APP_SITE_URL + `/posts/${postId}/comment`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({  comment: comment }),
			}
		);
		const updatedPost = await response.json();
		dispatch(setPost({ post: updatedPost }));
    setComment("")
	};

	return (
		<WidgetWrapper>
			<Friend
				friendId={postUserId}
				name={name}
				subtitle={location}
				userPicturePath={userPicturePath}
				postId={postId}
			/>
			<Typography color={main} sx={{ mt: "1rem" }}>
				{description}
			</Typography>
			{picturePath && (
				<img
					width="100%"
					height="auto"
					alt="post"
					style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
					src={picturePath}
				/>
			)}
			<FlexBetween mt="0.25rem">
				<FlexBetween gap="1rem">
					<FlexBetween gap="0.3rem">
						<IconButton onClick={patchLike}>
							{isLiked ? (
								<FavoriteOutlined sx={{ color: primary }} />
							) : (
								<FavoriteBorderOutlined />
							)}
						</IconButton>
						<Typography>{likeCount}</Typography>
					</FlexBetween>

					<FlexBetween gap="0.3rem">
						<IconButton onClick={() => setIsComments(!isComments)}>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{comments.length}</Typography>
					</FlexBetween>
				</FlexBetween>

				<IconButton>
					<ShareOutlined />
				</IconButton>
			</FlexBetween>
			{isComments && (
				<>
					<FlexBetween sx={{ gap: "0.5rem", mt: "0.25rem" }}>
						<InputBase
							placeholder="Add a comment..."
							onChange={(e) => setComment(e.target.value)}
							value={comment}
							sx={{
								width: "100%",
								backgroundColor: palette.neutral.light,
								borderRadius: "2rem",
								padding: "0.25rem 1.5rem",
							}}
						/>
						<IconButton
							onClick={addComment}
							disabled={!comment}
							sx={{ backgroundColor: palette.primary.light, p: "0.5rem" }}
						>
							<AddOutlined sx={{ color: palette.primary.dark }} />
						</IconButton>
					</FlexBetween>
					<Box mt="0.5rem">
						{comments.map((comment, i) => (
							<Box key={`${name}-${i}`}>
								<Divider />
								<Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
									{comment}
								</Typography>
							</Box>
						))}
						<Divider />
					</Box>
				</>
			)}
		</WidgetWrapper>
	);
};

export default PostWidget;
