Rails.application.routes.draw do

  root to: "raffler#index"

  resources :players

end
