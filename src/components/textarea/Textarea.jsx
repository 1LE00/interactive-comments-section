import './textarea.css';
import { forwardRef } from 'react';
const Textarea = forwardRef(({ name, placeholder }, ref) => {
  return (
    <textarea name={name} id={name} placeholder={placeholder} ref={ref}></textarea>
  )
})

export default Textarea