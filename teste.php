<?php

$cookiesString = "Session_Gov_Br_Prod=AhxeFUNcFTnxoMUpHlzYpHjlOwvA3eSDjY1Q_IKY.scp-59b8dcf967-vtpzl;path=/;domain=.sso.acesso.gov.br;secure;HttpOnly;SameSite=None;INGRESSCOOKIE=4a57b56ea106f83a;path=/;domain=certificado.sso.acesso.gov.br;domain=sso.acesso.gov.br;HttpOnly;Secure;SameSite=None;TS0197b850=0160f9695203c45c13430639820ec25dc95ee5282f1d5ac9207445517fe604b5ab7c49b42a060059dc6a25931166a2f579f9ab17c8;Path=/;TS0185eea4=0160f9695203c45c13430639820ec25dc95ee5282f1d5ac9207445517fe604b5ab7c49b42a060059dc6a25931166a2f579f9ab17c8;path=/;domain=.sso.acesso.gov.br;TS01f34a2a=0160f9695203c45c13430639820ec25dc95ee5282f1d5ac9207445517fe604b5ab7c49b42a060059dc6a25931166a2f579f9ab17c8;path=/;domain=certificado.sso.acesso.gov.br;TSd2153684027=0877702dbcab200067d3af5284f215e3e06e78d04accddbcd9275aededc13ff9c9e7ce8fe43187d30873fff9e711300085e24e2f322559d3bc27f3afafbaa1c12c37f9df6fe7acd0338cd7f89d0a7537d07926d99fed92c386ad707da597201d;Path=/;GovbrUid_IZJEW7DlUp7GhHOg=eyJraWQiOiJkZXZpY2VDcnlwdG9ncmFwaHkiLCJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0.._0TU9gzWBROTXMgm.2YatOHODMQAahWq_iexk8cTpgjVsjo2pQI3cl5UjkWFuPKxoEr8GvPPHaoQMikVFTAvv0jGAKoXzK5wvZ2Q6TjqvWjCMZC8v0oW5ZCHdrxPmHMWvm92fdZhWkBnpc1QfqZDyU-qUwIoHqclVV2P9mC5mHOOKfcM.vavWifRwyoUuDdLSN8gh0Q;path=/;domain=.sso.acesso.gov.br;secure;HttpOnly;Max-Age=34560000;Expires=Sat, 05-Dec-2026 12:05:36 GMT;SameSite=Strict;Govbrid=f6279244-a2ba-4c20-8ce3-ee879db224b2;path=/;domain=.sso.acesso.gov.br;secure;HttpOnly;Max-Age=34560000;Expires=Sat, 05-Dec-2026 12:05:36 GMT;SameSite=Strict";

$cookiePairs = explode(';', $cookiesString);
$cookieArray = [];

foreach ($cookiePairs as $k => $pair) {
    $parts = explode('=', trim($pair), 2);
    $cookieArray[] = [
        'name' => trim($parts[0]),
        'value' => isset($parts[1]) ? trim($parts[1]) : '',
        'domain' => '.sso.acesso.gov.br',
        'path' => '/',
        'sameSite'=>'lax',
        'storeId'=>'1',
        'id' => ($k+1)
    ];
}

// converte para JSON que o Python pode ler
echo json_encode($cookieArray, JSON_UNESCAPED_SLASHES);

