<?php

$cookiesString = "ASP.NET_SessionId=z5h5jssdnxli5pdajttpgyq1; assinadoc_cert_type=A1; COOKIECAV=9f19a6a3824b5c1f76ad6a24738b75c82c49f1eef16417e3f9f6a3f7d38011e38dcff77b5767cae86b482303f09f31c8fbdc5d08c89e0abe981f0b9fd4920b59; ecacrlmp=/EycZ1WtYLfrHRsc25kg5RlNqTAjUWRpXrhjdoQuzv8=; TS014d0691=01fef04d4ebf4046403402845891c9693c71ea73d41d0149124438dabc9745356f4ebeb9522dbd32457cedad08dded9cd648304c9a32f5e24c11429cad66440d44f8885193dbfef8e800c7c801b8f5802895e85864; TS0188162d=01fef04d4e7740e5d2c739ccfe4e8dfdf19bcb35fa1d0149124438dabc9745356f4ebeb9522dbd32457cedad08dded9cd648304c9a813fa00877849ed4144dc69b2c1f3ab6162adde296ab9d218209f08d47e5077b9867ec603c2d84bda0ea9b25cb4729f2; TSafd868f7027=082670627aab20005c56eb3f5a53ccbb3374daee9a76d68f4727a99e309b9ae1e00717b4f8893837085cb5947811300066aab95623452fe373a122522fb719205e1b579302cd599597a2297462ae519dfd248598a9529c6d353ef8040bc7dad4";


$cookiePairs = explode(';', $cookiesString);
$cookieArray = [];

foreach ($cookiePairs as $pair) {
    $parts = explode('=', trim($pair), 2);
    $cookieArray[] = [
        'name' => trim($parts[0]),
        'value' => isset($parts[1]) ? trim($parts[1]) : '',
        'domain' => 'camoufox.example.com',
        'path' => '/'
    ];
}

// converte para JSON que o Python pode ler
echo json_encode($cookieArray, JSON_UNESCAPED_SLASHES);




[ { "domain": ".cav.receita.fazenda.gov.br", "hostOnly": false, "httpOnly": false, "name": "assinadoc_cert_type", "path": "/", "sameSite": "None", "secure": false, "session": true, "storeId": "1", "value": "A1", "id": 1 }, { "domain": ".cav.receita.fazenda.gov.br", "hostOnly": false, "httpOnly": true, "name": "COOKIECAV", "path": "/", "sameSite": "None", "secure": true, "session": true, "storeId": "1", "value": "a490da26770d4e8d8ea9f17264094f76822fb74ed3b6e5852203fb4109bb8ff6e804f5d61ccb7680b2c7f88ce4785f6eb075edceed7f333fe3b5be88c099c95b", "id": 2 }, { "domain": ".cav.receita.fazenda.gov.br", "hostOnly": false, "httpOnly": false, "name": "TS0188162d", "path": "/", "sameSite": "None", "secure": false, "session": true, "storeId": "1", "value": "01fef04d4e2762be6e02f098edf2894468991880282d7460ca31d0f2790e3c35872367fdbb01a4b3487e34635e555e9bb88ed39c5b2773fc676fd019c060f9dc35197b3780628fc2bb10a4ae863149709fbfab30d5ecb155e49ec7af1de0d6937c8bd28c1c", "id": 3 }, { "domain": "cav.receita.fazenda.gov.br", "hostOnly": true, "httpOnly": true, "name": "ASP.NET_SessionId", "path": "/", "sameSite": "Lax", "secure": false, "session": true, "storeId": "1", "value": "lev4vapzbhivc4eemtx5a0zl", "id": 4 }, { "domain": "cav.receita.fazenda.gov.br", "hostOnly": true, "httpOnly": false, "name": "ecacrlmp", "path": "/", "sameSite": "None", "secure": false, "session": true, "storeId": "1", "value": "+RODxyLAPjyzaerKUdaForySS3lGlyP7SqWem9tf08A=", "id": 5 }, { "domain": "cav.receita.fazenda.gov.br", "hostOnly": true, "httpOnly": false, "name": "TS014d0691", "path": "/", "sameSite": "None", "secure": false, "session": true, "storeId": "1", "value": "01fef04d4ea97a07d6518f8399c128ec9d221254072d7460ca31d0f2790e3c35872367fdbb01a4b3487e34635e555e9bb88ed39c5b05f9c27c7e32b8e218d597cceba7bc18aea04fb6cec3c85426f026855160bbeb", "id": 6 }, { "domain": "cav.receita.fazenda.gov.br", "hostOnly": true, "httpOnly": false, "name": "TSafd868f7027", "path": "/", "sameSite": "None", "secure": false, "session": true, "storeId": "1", "value": "082670627aab200088b4c8fa26af70c49e85338226a07988cc2a5ee718d63bb24fda19431822289e086ddd8e39113000912a4f349a04c6a1fe6f2d41cb57df8915b497ad583756a9241590d4dc20141ef00c38f377b57a637f2eabf090c7f55a", "id": 7 } ]