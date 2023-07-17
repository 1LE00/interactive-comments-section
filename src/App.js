import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/card/Card';
import Post from './components/post/Post';
import Delete from './components/delete/Delete';
import Reply from './components/reply/Reply';

function App() {
  const CURRENT_USER_URL = 'http://localhost:3500/currentUser';
  const COUNTER_URL = 'http://localhost:3500/counter';
  const API_URL = 'http://localhost:3500/comments';
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setreplyToCommentId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDelete, setShowDelete] = useState({
    status: false,
    idToDelete: null,
    repliedTo: null,
    isReply: false
  });

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(CURRENT_USER_URL);
        const currentUserData = await response.json();
        setCurrentUser({
          username: currentUserData.username,
          src: {
            png: currentUserData.image.png,
            webp: currentUserData.image.webp
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchCurrentUser();
  }, []);

  // Fetch all the comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(API_URL);
        const listOfComments = await response.json();
        setComments(listOfComments);
      } catch (error) {
        console.log(error);
      }
    }
    fetchComments();
  }, []);

  return (
    <div className={`App flex flex-column interactive-comments`}>
      {/* Comments */}
      {comments && currentUser && comments.map(comment => {
        return <section key={comment.id} className='individual-comment flex flex-column w-100'>
          <Card key={comment.id}
            src={comment.user.image.png}
            username={comment.user.username}
            createdAt={comment.createdAt}
            article={comment.content}
            score={comment.score}
            id={comment.id}
            api={API_URL}
            you={comment.user.username === currentUser.username}
            comments={comments}
            isReply={false}
            setShowDelete={setShowDelete}
            setComments={setComments}
            setReply={() => setreplyToCommentId(comment.id)}
          />
          {currentUser && comment.id === replyToCommentId &&
            <Reply currentUser={currentUser}
              api={API_URL}
              id={comment.id}
              isReply={false}
              comments={comments}
              counter={COUNTER_URL}
              setComments={setComments}
              setreplyToCommentId={setreplyToCommentId} />}
          {/* Replies */}
          {comment.replies.length > 0 && <section className={`replies flex flex-column`}>
            {comment.replies.map(reply => {
              return <section key={reply.id} className={`reply-to reply-to-${reply.replyingTo} flex flex-column w-100`}>
                <Card key={reply.id}
                  src={reply.user.image.png}
                  username={reply.user.username}
                  createdAt={reply.createdAt}
                  article={reply.content}
                  score={reply.score}
                  id={reply.id}
                  commentId={reply.commentId}
                  replyingTo={reply.replyingTo}
                  api={API_URL}
                  comments={comments}
                  isReply={true}
                  you={reply.user.username === currentUser.username}
                  setShowDelete={setShowDelete}
                  setComments={setComments}
                  setReply={() => setreplyToCommentId(reply.id)}
                />
                {currentUser && reply.id === replyToCommentId &&
                  <Reply currentUser={currentUser}
                    api={API_URL}
                    counter={COUNTER_URL}
                    setComments={setComments}
                    comments={comments}
                    setreplyToCommentId={setreplyToCommentId}
                    id={reply.id}
                    isReply={true} />}
              </section>
            })}
          </section>}
        </section>
      })}
      {currentUser && <Post currentUser={currentUser} api={API_URL} counter={COUNTER_URL} setComments={setComments} />}
      {showDelete.status && <Delete setShowDelete={setShowDelete} showDelete={showDelete} api={API_URL} setComments={setComments} comments={comments} />}
    </div>
  );
}

export default App;
