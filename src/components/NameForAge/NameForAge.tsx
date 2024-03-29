import {Button, Div, FormItem, FormLayoutGroup, FormStatus, Header, SimpleCell, Spinner} from "@vkontakte/vkui";
import {useMutation} from "@tanstack/react-query";
import {SubmitHandler, useForm} from 'react-hook-form';
import {object, string} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useEffect, useState} from "react";

interface IFormInput {
    name: string
}

interface Age {
    age: number
}

const schema = object().shape({
    name: string()
        .required("Это обязательное поле")
        .matches(/^[^0-9]*$/, "Поле не должно содержать цифры")
        .matches(/^[A-Za-z]*$/, "Поле должно содержать только английские буквы")
        .matches(/^[\s\S]*\S[\s\S]*$/, "Поле не должно быть пустым")
});

const NameForAge = () => {

        const [age, setAge] = useState<number | null>(null);
        const [name, setName] = useState("");
        const [nameEntered, setNameEntered] = useState(false);
    const [lastSubmittedName, setLastSubmittedName] = useState("");

        const {
            register,
            handleSubmit,
            formState: {errors, isValid},
        } = useForm<IFormInput>({
            resolver: yupResolver(schema),
            mode: 'onTouched',
        })

        const {mutate, data, isPending, error} = useMutation<Age, Error, IFormInput>({
            mutationFn: async ({name}: IFormInput) => {
                const res = await fetch(`https://api.agify.io/?name=${name}`);
                if (!res.ok) {
                    throw new Error(await res.text());
                }
                return await res.json();
            }
        })

        const onSubmit: SubmitHandler<IFormInput> = async (data) => {
            try {
                await schema.validate(data);
                if (data.name !== lastSubmittedName) {
                    mutate(data);
                    setLastSubmittedName(data.name);
                }
            } catch (e) {
                console.error(e);
            }
        };
        useEffect(() => {
            if (nameEntered) {
                const timeoutId = setTimeout(() => {
                    onSubmit({name});
                }, 3000);
                return () => clearTimeout(timeoutId);
            }
        }, [name, nameEntered]);

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setName(value);
            setNameEntered(true);
        };
        useEffect(() => {
            if (data) {
                setAge(data.age);
            }
        }, [data]);

        return (
            <SimpleCell multiline>
                <Header multiline>Введите имя, чтобы узнать возраст</Header>
                <FormLayoutGroup mode="vertical">
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem htmlFor="name-for-age">
                            <span
                                className="vkuiFormField vkuiFormField--mode-default vkuiFormField--sizeY-none vkui-focus-visible vkuiInput vkuiInput--sizeY-none">
                            <input className="vkuiTypography vkuiInput__el vkuiText vkuiText--sizeY-none"
                                   {...register("name",)}
                                   onChange={handleInputChange}
                                   type="text"/>

                            </span>{errors.name && <FormStatus mode="error" header={errors.name.message}></FormStatus>}
                        </FormItem>
                        <FormItem>
                            <Button
                                disabled={!isValid || isPending}
                                stretched
                                mode="secondary"
                                type="submit"
                                size="m"
                            >Вперед!</Button>
                        </FormItem>
                    </form>
                </FormLayoutGroup>
                {isPending && <Spinner size="regular"/>}
                {error && <Div>Ошибка при получении данных</Div>}
                {age !== null ? (
                    <Div>Возраст: {age}</Div>
                ) : (
                    data && !isPending && !error && <Div>Ошибка: возраст не найден</Div>
                )}
            </SimpleCell>
        )
            ;
    }
;

export default NameForAge;