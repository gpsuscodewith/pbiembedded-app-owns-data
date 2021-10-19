/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { UserIcon } from './Icons';

import { fontFamily, fontSize, gray1, gray2, gray5 } from './Styles';

import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useAuth } from './Auth';
export const Header = () => (
    <div
        css={css`
        position: fixed;
        box-sizing: border-box;
        top: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background-color: #fff;
        border-bottom: 1px solid ${gray5};
        box-shadow: 0 3px 7px 0 rgba(110, 112, 114, 0.21);
        `}
    >
        <Link to="./home"
            css={css`
            font-size: 24px;
            font-weight: bold;
            color: ${gray1};
            text-decoration: none;
            `}
        >Web Portal</Link>
        <input type="text" placeholder="Search..." 
            css={css`
            box-sizing: border-box;
            font-family: ${fontFamily};
            font-size: ${fontSize};
            padding: 8px 10px;
            border: 1px solid ${gray5};
            border-radius: 3px;
            color: ${gray2};
            background-color: white;
            width: 200px;
            height: 30px;
            :focus {
            outline-color: ${gray5};
            }
        `}
    />
        <Link 
        to="./signin"
        css={css`
        font-family: ${fontFamily};
        font-size: ${fontSize};
        padding: 5px 10px;
        background-color: transparent;
        color: ${gray2};
        text-decoration: none;
        cursor: pointer;
        span {
        margin-left: 10px;
        }
        :focus {
        outline-color: ${gray5};
        }
    `}
  >
            <UserIcon />
            <span>Sign In</span>
        </Link>
    </div>
);