import styled, { css } from 'styled-components';

const TrafficLight = styled.View`
    border-radius:50px;
    width:10px;
    height:10px,
    padding:10px;

    ${(props) => 
        props.available &&
        css`
            background:#AFEC1A;
        `
    }

    ${(props) =>
        props.limited &&
        css`
            background:#FFE003;
        `
    }

    ${(props) =>
        props.unavailable &&
        css`
            background:#EC241A;
        `
    }
`;

export default TrafficLight;