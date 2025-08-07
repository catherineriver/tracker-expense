import React from "react";
import styles from "./Card.module.css";

type Props = {
    children?: React.ReactNode
    onPress?: () => void
}

export const Card: React.FC<Props> = ({
  children,
  onPress,
}) => {
    return (
        <div
            className={`${styles.card}`}
            onClick={onPress}
        >
            {children}
        </div>
    );
};
