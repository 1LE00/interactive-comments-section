import { useState } from 'react';
import Button from '../button/Button';
import './delete.css';
import apiRequest from '../../helper/apiRequest';
const Delete = ({ setShowDelete, showDelete, api, setComments, comments }) => {
    const [paragraph, setparagraph] = useState('Are you sure you want to delete this comment? This will remove the comment and can\'t be undone.');
    const [ok, setOk] = useState(false);
    const handleCancel = (params) => {
        setShowDelete({
            status: false,
            idToDelete: null,
            repliedTo: null,
            isReply: false
        });
        document.body.classList.remove('active');
    }

    const handleDelete = async (params) => {
        const id = showDelete.idToDelete;
        const isReply = showDelete.isReply;
        if (!isReply) {
            // Code to delete comments
            const result = await fetch(`${api}/${id}`, {
                method: 'DELETE'
            });

            if (result.ok) {
                setparagraph('Your comment has been deleted succesfully.');
                setOk(true);
                setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            }
        } else {
            // Code to delete replies
            const commentId = showDelete.repliedTo;
            const myComment = comments.filter(comment => comment.id === commentId);
            const replies = myComment[0].replies;
            const filteredReplies = replies.filter(reply => reply.id !== id);
            myComment[0].replies = filteredReplies;
            const url = `${api}/${commentId}`;
            try {
                const result = await apiRequest(url, 'PATCH', { replies: filteredReplies });
                if (result.ok) {
                    setparagraph('Your comment has been deleted succesfully.');
                    setOk(true);
                    setComments([...comments]);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleOK = () => {
        setShowDelete({
            status: false,
            idToDelete: null,
            repliedTo: null,
            isReply: false
        });
        document.body.classList.remove('active');
    }

    return (
        <section className='sect-delete flex'>
            <section className="delete-content flex flex-column">
                <h3 className="del-title">Delete comment</h3>
                <p className="del-paragraph">{paragraph}</p>
                <section className="actions flex w-100">
                    {ok ? <section className="btn-ok" onClick={handleOK}><Button text='OKAY' name='okay' /> </section> :
                        <>
                            <section className="btn-cancel" onClick={handleCancel}><Button text='NO, CANCEL' name='no' /></section>
                            <section className="btn-delete" onClick={handleDelete}><Button text='YES, DELETE' name='yes' /> </section>
                        </>
                    }
                </section>
            </section>
        </section>
    )
}

export default Delete