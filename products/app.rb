require 'sinatra'

# Lee la variable de entorno PORT o usa 3002 por defecto
set :port, ENV.fetch('PORT', 3002)
set :bind, '0.0.0.0'

enable :logging

before do
  headers "X-Powered-By" => "Sinatra"
end

get '/api/products' do
  content_type :json
  { service: "Sinatra Products API", products: ["Laptop", "Teclado", "Mouse"] }.to_json
end