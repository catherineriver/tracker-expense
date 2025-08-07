import React from "react";
import styles from "./Card.module.css";

type Props = {
    children?: React.ReactNode
    onPress?: () => void
    className?: string
}

export const Card: React.FC<Props> = ({
                                          children,
  onPress,
  className
}) => {
    return (
        <div
            className={`${styles.card} ${className}`}
            onClick={onPress}
        >
            {children}
        </div>
    );
};
