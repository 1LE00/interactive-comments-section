import './card.css';
import Likes from '../likes/Likes';
import Button from '../button/Button';
import Avatar from '../avatar/Avatar';
import Textarea from '../textarea/Textarea';
import apiRequest from '../../helper/apiRequest';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as Reply } from "../../assets/icons/icon-reply.svg";
import { ReactComponent as Delete } from "../../assets/icons/icon-delete.svg";
import { ReactComponent as Edit } from "../../assets/icons/icon-edit.svg";
import { ReactComponent as Cancel } from "../../assets/icons/icon-close.svg";
import useTimeAgo from '../../helper/formatTime';

const Card = ({ src, username, createdAt, article, score, replyingTo, you, id, commentId, api, comments, isReply, setShowDelete, setComments, setReply }) => {
    const [editable, setEditable] = useState(false);
    const [edited, setEdited] = useState(false);
    const editField = useRef(null);
    const paragraphField = useRef(null);
    const [temp, setTemp] = useState('');
    const COMMENT_URL = `${api}/${id}`;
    const usernameRegex = /@\w+\s(.*)/;
    const postedAt = useTimeAgo(createdAt);

    const handleDeleteModal = () => {
        setShowDelete({
            status: true,
            idToDelete: id,
            repliedTo: commentId,
            isReply: isReply
        });
        document.body.classList.add('active');
    }

    const handleEdit = () => {
        if (paragraphField.current)
            setTemp(paragraphField.current.innerText);
        setEditable(true);
    }

    useEffect(() => {
        if (editable) {
            editField.current.value = temp;
            editField.current.focus();
        }
    }, [editable, temp]);

    const handleUpdate = async () => {
        const valueTOBeUpdated = editField.current.value.trim();
        if (valueTOBeUpdated.length === 0) {
            editField.current.focus();
            return
        }

        if (!isReply) {
            // update the comments
            try {
                const result = await apiRequest(COMMENT_URL, 'PATCH', { content: valueTOBeUpdated, createdAt: new Date().toISOString() });
                if (result.ok) {
                    const [myComment] = comments.filter(comment => comment.id === id);
                    myComment.content = valueTOBeUpdated;
                    myComment.createdAt = new Date().toISOString();
                    setEditable(false);
                    setComments([...comments]);
                    setEdited(true);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            // update the replies
            const [myComment] = comments.filter(comment => comment.id === commentId);
            const [myReply] = myComment.replies.filter(reply => reply.id === id);
            const endpoint = myReply.commentId;

            // filter out initial @username
            const matches = valueTOBeUpdated.match(usernameRegex);
            if (matches && matches.length > 1) {
                const extractedText = matches[1];
                myReply.content = extractedText;
            } else {
                myReply.content = valueTOBeUpdated;
            }

            try {
                const url = `${api}/${endpoint}`;
                const result = await apiRequest(url, 'PATCH', { replies: myComment.replies });
                if (result.ok) {
                    setEditable(false);
                    setComments([...comments]);
                    setEdited(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleUpdateCancel = () => {
        setEditable(false);
    }

    const handleReplyInitiator = (e) => {
        setReply();
    }

    return (
        <section className='card flex w-100'>
            <section className="card-content flex flex-column w-100">
                <section className="card-header flex">
                    <section className="card-avatar avatar">
                        <Avatar src={src} name={username} />
                    </section>
                    <section className="avatar-info flex">
                        <section className="avatar-username">{username}</section>
                        {you && <section className="attribute">you</section>}
                    </section>
                    <section className="created-at">{postedAt}</section>
                    {edited && <section className="edited">Edited</section>}
                </section>
                <article className="card-article w-100">
                    {!editable && <p ref={paragraphField} className="content">{replyingTo && <span className='replying-to'>{`@${replyingTo}`}&nbsp;</span>}{`${article}`}</p>}
                    {editable && <Textarea name={`edit-${id}`} ref={editField} placeholder='' />}
                </article>
            </section>
            <Likes score={score} id={id} api={api} comments={comments} isReply={isReply} />
            {you ?
                <section className="card-actions flex">
                    {editable ?
                        <>
                            <Button svg={<Cancel />} text='Cancel' name='cancel-update' handleUpdateCancel={handleUpdateCancel} />
                            <Button svg={<Edit />} text='Update' name='update' handleUpdate={handleUpdate} />
                        </>
                        :
                        <>
                            <Button svg={<Delete />} text='Delete' name='delete-initiator' handleDelete={handleDeleteModal} />
                            <Button svg={<Edit />} text='Edit' name='edit' handleEdit={handleEdit} />
                        </>
                    }
                </section> :
                <Button svg={<Reply />} text='Reply' name='reply-initiator' handleReplyInitiator={handleReplyInitiator} />
            }

        </section>
    )
}

export default Card