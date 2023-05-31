import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import s from './BuilderField.module.scss';

interface Props {
    children: React.ReactNode;
    item: QuestionItemProps;
    activeQuestionItem?: QuestionItemProps;
    onEditClick?: (item: QuestionItemProps | undefined) => void;
}

export function BuilderField(props: Props) {
    const { children, item, activeQuestionItem, onEditClick } = props;
    const { hidden } = item.questionItem;

    if (hidden) {
        return null;
    }

    return (
        <div
            className={classNames(s.container, {
                _active: item.questionItem.linkId === activeQuestionItem?.questionItem.linkId,
            })}
        >
            <div className={s.panel}>
                <Button type="text" className={s.button} onClick={() => onEditClick?.(item)}>
                    <SettingOutlined />
                </Button>
            </div>
            {children}
        </div>
    );
}
