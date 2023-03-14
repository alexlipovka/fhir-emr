import { Form, InputNumber, InputNumberProps } from 'antd';
import Title from 'antd/lib/typography/Title';
import { GroupItemProps } from 'sdc-qrf';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './styles.module.scss';

function getFieldName(parentPath: string[], item: QuestionnaireItem) {
    return [...parentPath, item.linkId, 0, 'value', item.type];
}

interface BloodPressureItemProps extends InputNumberProps {
    parentPath: string[];
    questionItem: QuestionnaireItem;
    unit?: string;
}

function BloodPressureItem(props: BloodPressureItemProps) {
    const { parentPath, questionItem } = props;

    const fieldName = getFieldName(parentPath, questionItem);

    const { value, onChange, disabled, hidden } = useFieldController(fieldName, questionItem);

    return (
        <Form.Item hidden={hidden} label={questionItem.text}>
            <InputNumber
                style={{ width: '100%' }}
                disabled={disabled}
                value={value}
                onChange={onChange}
                addonAfter={'mmHg'}
            />
        </Form.Item>
    );
}

export function BloodPressure({ parentPath, questionItem }: GroupItemProps) {
    if (typeof questionItem.item === 'undefined' || questionItem.item.length !== 2) {
        return <p>Blood pressure widget requires exactly two children</p>;
    }

    const groupFieldName = [...parentPath, questionItem.linkId, 'items'];

    const [firstItem, secondItem] = questionItem.item;

    const { unit } = questionItem as { unit?: string };

    return (
        <div className={s.row}>
            <div className={s.inputWrapper}>
                <BloodPressureItem
                    parentPath={groupFieldName}
                    questionItem={firstItem!}
                    unit={unit}
                />
            </div>

            <div className={s.splitterWrapper}>
                <div className={s.splitter}>/</div>
            </div>

            <div className={s.inputWrapper}>
                <BloodPressureItem
                    parentPath={groupFieldName}
                    questionItem={secondItem!}
                    unit={unit}
                />
            </div>
        </div>
    );
}

function BloodPressureItemReadOnly(props: BloodPressureItemProps) {
    const { parentPath, questionItem } = props;
    const fieldName = getFieldName(parentPath, questionItem);
    const { value, hidden } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <p className={s.rowReadOnly}>
            <span className={s.questionText}>{questionItem.text}</span>
            <span className={s.answer}>{typeof value !== 'undefined' ? `${value} mmHg` : '-'}</span>
        </p>
    );
}

export function BloodPressureReadOnly({ parentPath, questionItem }: GroupItemProps) {
    if (typeof questionItem.item === 'undefined' || questionItem.item.length !== 2) {
        return <p>Blood pressure widget requires exactly two children</p>;
    }

    const groupFieldName = [...parentPath, questionItem.linkId, 'items'];

    const [firstItem, secondItem] = questionItem.item;

    return (
        <div>
            <Title level={5} className={s.title}>
                Blood Pressure
            </Title>
            <BloodPressureItemReadOnly parentPath={groupFieldName} questionItem={firstItem!} />
            <BloodPressureItemReadOnly parentPath={groupFieldName} questionItem={secondItem!} />
        </div>
    );
}