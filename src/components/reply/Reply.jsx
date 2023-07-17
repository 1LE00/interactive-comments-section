import Avatar from '../avatar/Avatar';
import Textarea from '../textarea/Textarea';
import Button from '../button/Button';
import updateCounter from '../../helper/updateCounter';
import { useRef } from 'react';
import apiRequest from '../../helper/apiRequest';

const Reply = ({ currentUser, setreplyToCommentId, comments, api, id, counter, setComments, isReply }) => {
    const replyField = useRef(null);

    const handleReply = async (e) => {
        e.preventDefault();
        const COMMENT_URL = `${api}/${id}`;

        const replyValue = replyField.current.value.trim();
        // get counter
        const counterResponse = await fetch(counter);
        const counterResult = await counterResponse.json();
        //check if comment is reply or not
        if (!isReply) {
            const [myComment] = comments.filter(comment => comment.id === id);
            const replyingTo = myComment.user.username;
            const replies = myComment.replies;
            handleReplySubmission(counterResult, replyValue, replyingTo, replies, COMMENT_URL, myComment, id)
        } else {
            const [myComment] = comments.filter(comment => comment.replies.filter(reply => reply.id === id).length > 0 ? comment : null);
            const commentId = myComment.id;
            const replies = myComment.replies;
            const replyURL = `${api}/${commentId}`
            const myCommentReplies = myComment.replies;
            const [commentToReplyTo] = myCommentReplies.filter(mcr => mcr.id === id);
            const replyingTo = commentToReplyTo.user.username;
            handleReplySubmission(counterResult, replyValue, replyingTo, replies, replyURL, myComment, commentId);
        }
    }

    const handleReplySubmission = async (counterResult, replyValue, replyingTo, replies, url, myComment, id) => {
        const replyObject = {
            id: counterResult.id + 1,
            commentId: id,
            content: replyValue,
            createdAt: new Date().toISOString(),
            score: 0,
            replyingTo: replyingTo,
            user: {
                image: {
                    png: currentUser.src.png,
                    webp: currentUser.src.webp
                },
                username: currentUser.username
            }
        }

        const result = await apiRequest(url, 'PATCH', { replies: [...replies, replyObject] });
        if (result.ok) {
            setreplyToCommentId(null);
            await updateCounter(counter, counterResult);
            myComment.replies = [...replies, replyObject];
            setComments([...comments]);
        }
    }

    const handleReplyCancel = () => {
        setreplyToCommentId(null);
    }

    return (
        <section className='reply w-100' >
            <form action="" className='w-100 flex reply-form' name='reply-form' method='post'>
                <section className="reply-content form-content w-100">
                    <Textarea placeholder='' name='reply' ref={replyField} />
                </section>
                <section className="reply-avatar avatar">
                    <Avatar src={currentUser.src.png} name={currentUser.username} />
                </section>
                <section className='flex reply-actions'>
                    <section className="btn-to-publish">
                        <Button text='CANCEL' name='reply-cancel-button' handleReplyCancel={handleReplyCancel} />
                    </section>
                    <section className="btn-to-publish">
                        <Button type={true} text='REPLY' name='reply' handleReply={handleReply} />
                    </section>
                </section>
            </form>
        </section>
    )
}

export default Reply