const Button = ({ svg, text, name, type, handleEdit, handleDelete, handleUpdate, handleUpdateCancel, handleReplyInitiator, handleReply, handleReplyCancel }) => {
    return (
        <button type={type ? 'submit' : 'button'} className={`btn-${name}`} onClick={handleEdit || handleDelete || handleUpdateCancel || handleUpdate || handleReplyInitiator || handleReply || handleReplyCancel || null}>
            {svg && <section className={`${name}-img-container`}>{svg}</section>}
            {text && <section className={`btn-text`}>{text}</section>}
        </button>
    )
}

export default Button