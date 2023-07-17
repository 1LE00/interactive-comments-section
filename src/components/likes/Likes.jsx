import Button from '../button/Button';
import { ReactComponent as Plus } from "../../assets/icons/icon-plus.svg";
import { ReactComponent as Minus } from "../../assets/icons/icon-minus.svg";
import { useState } from 'react';
import './likes.css';
import apiRequest from '../../helper/apiRequest';


const Likes = ({ score, id, api, comments, isReply }) => {
    const [like, setLike] = useState(score);
    const COMMENT_URL = `${api}/${id}`;
    const handlePlus = async () => {
        // creating new variable to store score because updated score value isn't available
        const updatedScore = like + 1;
        setLike(updatedScore);
        if (!isReply) {
            await apiRequest(COMMENT_URL, 'PATCH', { score: updatedScore });
        } else {
            handleReplyScore(updatedScore);
        }
    }

    const handleMinus = async () => {
        // creating new variable because updated like value isn't available
        const updatedScore = like > 0 ? like - 1 : 0;
        setLike(updatedScore);
        if (!isReply) {
            like !== 0 && await apiRequest(COMMENT_URL, 'PATCH', { score: updatedScore });
        } else {
            handleReplyScore(updatedScore);
        }
    }

    const handleReplyScore = (updatedScore) => {
        comments.filter(async comment => {
            const replies = comment.replies;
            const myReply = replies.filter(reply => reply.id === id);
            if (myReply.length > 0) {
                const endpoint = myReply[0].commentId;
                myReply[0].score = updatedScore;
                const url = `${api}/${endpoint}`;
                await apiRequest(url, 'PATCH', { replies: replies });
            }
        });
    }

    return (
        <section className='likes flex'>
            <section className="plus" onClick={handlePlus}><Button name='plus' svg={<Plus />} /></section>
            <section className="score flex">{like}</section>
            <section className="minus flex" onClick={handleMinus}><Button name='minus' svg={<Minus />} /></section>
        </section>
    )
}

export default Likes