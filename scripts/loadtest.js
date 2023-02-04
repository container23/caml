import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '15s', target: 0 },
  ],
};

export default function () {
  const BASE_URL = 'https://caml.container23.com';
  // search 
  group('AML_SEARCH', function () {
    let res = http.get(`${BASE_URL}/aml/search?term=test`, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'status is 200': (r) => r.status === 200
    });
    sleep(1);
  });

  // group('HOME PAGE', function () {
  //   http.get('');
  //   sleep(1);
  // });

}

// Localhost Results (Reading From File + Analytics disabled)
// running (1m00.8s), 000/100 VUs, 438 complete and 0 interrupted iterations
// http_req_duration avg=10.27s   min=137.03ms med=12.29s  max=12.94s   p(90)=12.74s   p(95)=12.79s  


// Prod instance Results (Reading From File + Analytics enabled)
// running (1m08.6s), 000/100 VUs, 241 complete and 0 interrupted iterations
// http_req_duration avg=22.58s   min=522.37ms med=25.16s  max=27.58s   p(90)=27.37s   p(95)=27.47s  
