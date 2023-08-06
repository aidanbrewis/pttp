


const Button = ({ type = 'button', onClick, children, ...rest }) => {
    return (
      <button type={type} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  };

  export default Button