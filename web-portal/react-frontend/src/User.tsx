import { FC } from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { gray2, gray3 } from './Styles';
import { UserData } from './Models/User';

interface Props {
    data: UserData;
}

export const User: FC<Props> = ({data}) => (
    <div
      css={css`
        padding: 10px 0px;
      `}
    >
      <div
        css={css`
          padding: 10px 0px;
          font-size: 19px;
        `}
      >
        {data.lastName}, {data.firstName}
        </div>
    <div
      css={css`
        font-size: 12px;
        font-style: italic;
        color: ${gray3};
      `}
    >
      {data.email}
    </div>

    </div>
);