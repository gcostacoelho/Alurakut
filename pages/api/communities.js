import {SiteClient} from 'datocms-client';

export default async function recebedorRequest(request, response){
    if(request.method=== 'POST'){
        
        const token = '93f5bb0b5648a913281775f37115a0';
        const client = new SiteClient(token);

        const registro = await client.items.create({
            itemType: "967695", //ID dado pelo DatoCMS
            ...request.body,
        })

        console.log(registro);

        response.json({
            dados: 'Algum dado',
            register: registro
        })

        return;
    }
    response.status(404).json({
        message: "Página não encontrada"
    })
}