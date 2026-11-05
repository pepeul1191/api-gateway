require 'sinatra'

set :port, 3002
set :bind, '0.0.0.0'

before do
  headers "X-Powered-By" => "Sinatra"
end

get '/api/products' do
  content_type :json
  { service: "Sinatra Products API", products: ["Laptop", "Teclado", "Mouse"] }.to_json
end