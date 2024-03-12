import {Button, Div, FormItem, FormLayoutGroup, FormStatus, Header, SimpleCell, Spinner} from "@vkontakte/vkui";
import {useMutation, useQuery} from "@tanstack/react-query";
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
        .matches(/^[A-ZА-ЯЁ].*$/, "Имя должно начинаться с заглавной буквы")
        .matches(/^[\s\S]*\S[\s\S]*$/, "Поле не должно быть пустым")
});


const NameForAge = () => {
        const [age, setAge] = useState<number | null>(null);
        const {
            register,
            handleSubmit,
            formState: {errors}
        } = useForm<IFormInput>({
            resolver: yupResolver(schema),
        })


        const {data,  isLoading, error} = useQuery<Age>({
            queryKey: ['name-for-age'],
            queryFn: async ({queryKey}) => {
                const name = queryKey[1] as string;
                console.log(name)
                if (!name) {
                    throw new Error('Не удалось получить имя для запроса');
                }
                console.log(name)
                const res = await fetch(`https://api.agify.io/?name=${name}`);
                return await res.json();
            },
            staleTime: 1000,
            refetchOnWindowFocus: false,
            enabled: false,
        })

    const mutation = useMutation({
        mutationFn: async ({name}: IFormInput) => {
            const res = await fetch(`https://api.agify.io/?name=${name}`);
            console.log(res)
            return await res.json();
        }
    })
    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        mutation.mutate(data)
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
                                   type="text"/>

                            </span>{errors.name && <FormStatus mode="error" header={errors.name.message}></FormStatus>}
                        </FormItem>
                        <FormItem>
                            <Button
                                disabled={!!errors.name || isLoading}
                                stretched
                                mode="secondary"
                                type="submit"
                                size="m"
                            >Вперед!</Button>
                        </FormItem>
                    </form>
                </FormLayoutGroup>
                {isLoading && <Spinner size="regular"/>}
                {error && <Div>Ошибка при получении данных</Div>}
                {age && <Div>Возраст: {age}</Div>}
            </SimpleCell>
        )
            ;
    }
;

export default NameForAge;