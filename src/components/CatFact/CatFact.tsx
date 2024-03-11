import {Button, Div, FormItem, FormLayoutGroup, Header, SimpleCell, Spinner, Textarea} from "@vkontakte/vkui";
import {useEffect, useRef} from "react";
import {useQuery} from "@tanstack/react-query";

interface CatFact {
    fact: string;
}
const CatFact = () => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {data, error, refetch, isLoading} = useQuery<CatFact>({
        queryKey: ['cat-fact'],
        queryFn: async () =>
            await fetch('https://catfact.ninja/fact')
                .then(res => res.json()),

        refetchOnWindowFocus: false,
        enabled: false
    })

    const handleClick = () => {
        refetch();
    };

    useEffect(() => {
        if (data && textAreaRef.current) {
            textAreaRef.current.value = data.fact;
            textAreaRef.current.setSelectionRange(data.fact.indexOf(' '), data.fact.indexOf(' '));
            textAreaRef.current.focus();
        }
    }, [data]);
    return (
        <SimpleCell multiline>
            <Header multiline>Нажмите на кнопку, чтобы получить случайный факт о котах</Header>
            <FormLayoutGroup mode="vertical">
                <FormItem htmlFor="cat-fact-input">
                    {isLoading && <Spinner size="regular"  />}
                    {error && <Div>Ошибка при получении данных</Div>}
                    <Textarea
                        getRef={textAreaRef}
                        value={(data && data.fact) || ''}
                        id="cat-fact-input"
                        rows={3}
                    />

                </FormItem>
                <FormItem>
                    <Button stretched mode="secondary" type="submit" onClick={handleClick}
                            size="m">Вперед!</Button>
                </FormItem>
            </FormLayoutGroup>
        </SimpleCell>
    );
};

export default CatFact;