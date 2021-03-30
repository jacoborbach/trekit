import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';
import { Link } from 'react-router-dom'

const Menu = ({ open, ...props }) => {

    const isHidden = open ? true : false;
    // const tabIndex = isHidden ? 0 : -1;

    return (
        <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
            <Link to='/myMap'>Map</Link>
            <Link to='/settings'>Settings </Link>
        </StyledMenu>
    )
}

Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu;
